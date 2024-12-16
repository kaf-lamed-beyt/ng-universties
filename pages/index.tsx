import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>
          API: List of Nigerian universities, faculties and their departments
        </title>
      </Head>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Go to /api/v1/universities/index.ts</p>
      </div>
    </>
  );
}
