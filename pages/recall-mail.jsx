import Layout from "../components/Layout";

export default function RecallMail() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Mail di Recall (24h prima)</h2>
        <textarea
          className="w-full h-64 bg-[#0d1117] border border-[#30363d] rounded p-3 text-sm"
          defaultValue={"Gentile Cliente,\n\nti ricordiamo l'appuntamento previsto per domani alle ore 14:30.\n\nAllego la documentazione utile alla riunione.\n\nResto a disposizione,\n\nCordiali saluti,\n[Il tuo nome]\nWESIONARY"}
        />
      </div>
    </Layout>
  );
}