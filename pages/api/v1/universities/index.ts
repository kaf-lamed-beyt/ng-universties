import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { University } from "@/types/university.type";

let cachedUniversities: University[] | null = null;

function loadUniversities(): University[] {
  if (!cachedUniversities) {
    const directory = path.join(process.cwd(), "data", "universities");
    cachedUniversities = fs
      .readdirSync(directory)
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const filePath = path.join(directory, file);
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
      });
  }
  return cachedUniversities;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;

  switch (method) {
    case "GET":
      try {
        const universities = loadUniversities();
        const { type, city, state, acronym, page = "1", limit = "20" } = query;

        const typeFilter = Array.isArray(type) ? type[0] : type;
        const cityFilter = Array.isArray(city) ? city[0] : city;
        const stateFilter = Array.isArray(state) ? state[0] : state;
        const acronymFilter = Array.isArray(acronym) ? acronym[0] : acronym;
        const currentPage = page as string;
        const pageLimit = limit as string;

        let filtered = universities.filter((university) => {
          if (
            typeFilter &&
            university.type?.toLowerCase() !== typeFilter.toLowerCase()
          ) {
            return false;
          }
          if (
            cityFilter &&
            university.location.city?.toLowerCase() !== cityFilter.toLowerCase()
          ) {
            return false;
          }
          if (
            stateFilter &&
            university.location.state?.toLowerCase() !==
              stateFilter.toLowerCase()
          ) {
            return false;
          }
          if (
            acronymFilter &&
            university.acronym?.toLowerCase() !== acronymFilter.toLowerCase()
          ) {
            return false;
          }
          return true;
        });

        // Pagination
        const start = (parseInt(currentPage) - 1) * parseInt(pageLimit);
        const end = start + parseInt(pageLimit);
        filtered = filtered.slice(start, end);

        res.status(200).json(filtered);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error retrieving university data", error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
