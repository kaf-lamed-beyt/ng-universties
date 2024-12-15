import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { University } from "@/public/data.type";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<University[] | { message: string; error: unknown }>,
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const universitiesDirectory = path.join(
          process.cwd(),
          "data",
          "universities",
        );
        const universityFiles = fs.readdirSync(universitiesDirectory);

        const universities: University[] = universityFiles
          .filter((file) => file.endsWith(".json"))
          .map((file) => {
            const filePath = path.join(universitiesDirectory, file);
            const fileContents = fs.readFileSync(filePath, "utf8");
            return JSON.parse(fileContents);
          });

        res.status(200).json(universities);
      } catch (error) {
        res.status(500).json({
          message: "Error retrieving university data",
          error: error,
        });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
