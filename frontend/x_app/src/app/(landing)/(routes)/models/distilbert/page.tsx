import { AppSidebar } from "@/components/app-sidebar";
import Image from "next/image";

const BertPage = () => {
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="w-2/3 bg-white overflow-y-auto shadow-lg rounded-lg p-6">
        <article className="prose lg:prose-xl max-w-none">
          <h1 className="text-4xl font-bold text-gray-800">
            DistilBERT: A Distilled Version of BERT
          </h1>
          <p className="text-gray-600 leading-relaxed">
            DistilBERT is a smaller, faster, cheaper, and lighter version of
            BERT. It retains 97% of BERT's language understanding while being
            60% faster and 40% smaller.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8">
            Introduction
          </h2>
          <p className="text-gray-600 leading-relaxed">
            BERT (Bidirectional Encoder Representations from Transformers) has
            revolutionized the field of NLP by providing a powerful pre-trained
            model that can be fine-tuned for various tasks. However, BERT is
            computationally expensive and requires significant resources to run.
          </p>

          <div className="my-6">
            <Image
              src="/distilbert.png"
              alt="DistilBERT Overview"
              width={800}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8">
            Code Example
          </h2>
          <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto text-sm text-gray-800">
            <code className="language-python">
              {`import torch
from transformers import DistilBertModel, DistilBertTokenizer

tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
model = DistilBertModel.from_pretrained('distilbert-base-uncased')

inputs = tokenizer("Hello, how about today", return_tensors="pt")
outputs = model(**inputs)

print(outputs.last_hidden_state)`}
            </code>
          </pre>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8">
            Performance
          </h2>
          <p className="text-gray-600 leading-relaxed">
            DistilBERT retains 97% of BERT's performance on language
            understanding benchmarks while being 60% faster and 40% smaller.
            This makes it an attractive option for deploying NLP models in
            production environments where resources are limited.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8">
            Conclusion
          </h2>
          <p className="text-gray-600 leading-relaxed">
            DistilBERT offers a compelling alternative to BERT for many NLP
            tasks. Its smaller size and faster inference time make it a
            practical choice for real-world applications.
          </p>
        </article>
      </div>

      {/* Menu Section */}
      <div className="w-1/3 p-4">
        <h2 className="text-xl font-semibold">Menu Section</h2>
        {/* Menü içeriğinizi buraya ekleyebilirsiniz */}
      </div>
    </div>
  );
};

export default BertPage;
