import os
import uuid
import boto3
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from PyPDF2 import PdfReader

load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

document_store = {}

AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')
KNOWLEDGE_BASE_ID = os.environ.get('KNOWLEDGE_BASE_ID')
CLAUDE_MODEL = 'anthropic.claude-3-haiku-20240307-v1:0'

bedrock_agent = boto3.client('bedrock-agent-runtime', region_name=AWS_REGION)
bedrock_runtime = boto3.client('bedrock-runtime', region_name=AWS_REGION)


def extract_text_from_pdf(filepath):
    reader = PdfReader(filepath)
    text = ''
    for page in reader.pages:
        text += page.extract_text() + '\n'
    return text


def query_knowledge_base(query):
    response = bedrock_agent.retrieve(
        knowledgeBaseId=KNOWLEDGE_BASE_ID,
        retrievalQuery={'text': query},
        retrievalConfiguration={
            'vectorSearchConfiguration': {
                'numberOfResults': 5
            }
        }
    )
    results = []
    for result in response.get('retrievalResults', []):
        results.append(result['content']['text'])
    return '\n\n'.join(results)


def call_claude(system_prompt, user_message):
    body = json.dumps({
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': 2048,
        'temperature': 0,
        'system': system_prompt,
        'messages': [
            {'role': 'user', 'content': user_message}
        ]
    })
    response = bedrock_runtime.invoke_model(
        modelId=CLAUDE_MODEL,
        body=body,
        contentType='application/json',
        accept='application/json'
    )
    result = json.loads(response['body'].read())
    return result['content'][0]['text']


def generate_initial_review(document_text, filename):
    kb_context = query_knowledge_base(
        f'legal standards requirements for {filename} contract review UK law'
    )

    system_prompt = (
        "You are an expert AI paralegal assistant at Keating Solicitors LLP, "
        "specialising in UK law and legal document review. "
        "You have access to the firm internal knowledge base of legal standards and best practices. "
        "Use this knowledge base context to assess the uploaded document against established standards. "
        "\n\nKNOWLEDGE BASE - FIRM LEGAL STANDARDS:\n"
        + kb_context +
        "\n\nYour job is to review documents against these standards and flag any issues clearly."
    )

    user_message = (
        "Review this legal document against our firm standards and provide:\n\n"
        "1. DOCUMENT SUMMARY - What type of document is this and what is its purpose?\n"
        "2. KEY PARTIES - Who are the parties involved?\n"
        "3. KEY TERMS - What are the most important terms and obligations?\n"
        "4. RISK FLAGS - List every clause that falls below our firm standards, is missing, "
        "unusual, or potentially unenforceable. Be specific and cite the relevant standard.\n"
        "5. RECOMMENDATIONS - What must be addressed before this document is executed?\n\n"
        "Be thorough. This is a professional legal review.\n\n"
        "DOCUMENT:\n"
        + document_text[:8000]
    )

    return call_claude(system_prompt, user_message)


def answer_question(doc_id, question):
    document = document_store[doc_id]

    kb_context = query_knowledge_base(question)

    system_prompt = (
        "You are an expert AI paralegal assistant at Keating Solicitors LLP. "
        "You are answering questions about a specific uploaded document. "
        "Answer based on BOTH the content of the uploaded document "
        "and the firm legal standards from the knowledge base. "
        "\n\nKNOWLEDGE BASE - FIRM LEGAL STANDARDS:\n"
        + kb_context +
        "\n\nAlways cite which section of the document your answer comes from. "
        "If a clause falls below the firm standards, say so clearly. "
        "If something is not in the document, say so and direct to a qualified solicitor."
    )

    user_message = (
        "Document: " + document['filename'] + "\n\n"
        "Question: " + question + "\n\n"
        "Document content:\n"
        + document['text'][:8000]
    )

    return call_claude(system_prompt, user_message)


@app.route('/api/upload', methods=['POST'])
def upload_document():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are supported'}), 400

    doc_id = str(uuid.uuid4())
    filepath = os.path.join(UPLOAD_FOLDER, f'{doc_id}.pdf')
    file.save(filepath)

    try:
        text = extract_text_from_pdf(filepath)

        if not text.strip():
            return jsonify({'error': 'Could not extract text from PDF'}), 400

        print(f'Generating review for {file.filename} using Bedrock Knowledge Base...')
        initial_review = generate_initial_review(text, file.filename)

        document_store[doc_id] = {
            'filename': file.filename,
            'text': text,
            'pages': len(PdfReader(filepath).pages)
        }

        return jsonify({
            'doc_id': doc_id,
            'filename': file.filename,
            'pages': len(PdfReader(filepath).pages),
            'initial_review': initial_review,
            'message': 'Document uploaded and analysed successfully'
        })

    except Exception as e:
        print(f'Upload error: {str(e)}')
        return jsonify({'error': str(e)}), 500


@app.route('/api/ask', methods=['POST'])
def ask_question():
    data = request.get_json()

    doc_id = data.get('doc_id')
    question = data.get('question')

    if not doc_id or not question:
        return jsonify({'error': 'doc_id and question are required'}), 400

    if doc_id not in document_store:
        return jsonify({'error': 'Document not found. Please upload again.'}), 404

    try:
        answer = answer_question(doc_id, question)
        return jsonify({
            'answer': answer,
            'filename': document_store[doc_id]['filename']
        })

    except Exception as e:
        print(f'Question error: {str(e)}')
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'AI Paralegal',
        'knowledge_base': KNOWLEDGE_BASE_ID
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)