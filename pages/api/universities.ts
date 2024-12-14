import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

export interface University {
  name: string;
  acronym: string;
  location: {
    city: string;
    state: string;
  };
  founded: number;
  website: string;
  faculties: {
    name: string;
    departments: string[];
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<University[] | University | { message: string; error: unknown }>,
) {
  const { method } = req;
  const universitiesDirectory = path.join(process.cwd(), "data", "universities");

  switch (method) {
    case "GET":
      try {
        const universityFiles = await fs.readdir(universitiesDirectory);

        const universities: University[] = await Promise.all(
          universityFiles
            .filter((file) => file.endsWith(".json"))
            .map(async (file) => {
              const filePath = path.join(universitiesDirectory, file);
              const fileContents = await fs.readFile(filePath, "utf8");
              return JSON.parse(fileContents);
            })
        );

        res.status(200).json(universities);
      } catch (error) {
        res.status(500).json({
          message: "Error retrieving university data",
          error: error,
        });
      }
      break;

    case "POST":
      try {
        const university: University = req.body;
        
        // Validate the university data using the existing schema
        const validateUniversity = async (data: University) => {
          const { default: Ajv } = await import("ajv");
          const { default: addFormats } = await import("ajv-formats");
          const ajv = new Ajv();
          addFormats(ajv);
          
          const schema = {
            type: "object",
            properties: {
              name: { type: "string", minLength: 3 },
              acronym: { type: "string", pattern: "^[A-Z]+$" },
              location: {
                type: "object",
                properties: {
                  city: { type: "string" },
                  state: { type: "string" }
                },
                required: ["city", "state"]
              },
              founded: { 
                type: "number",
                minimum: 1900,
                maximum: new Date().getFullYear()
              },
              website: {
                type: "string",
                format: "uri",
                pattern: "^https?://.*\\.edu\\.ng$"
              },
              faculties: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    departments: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["name", "departments"]
                }
              }
            },
            required: ["name", "acronym", "location", "founded", "website", "faculties"]
          };

          const validate = ajv.compile(schema);
          return validate(data);
        };
        const isValid = await validateUniversity(university);
        
        if (!isValid) {
          return res.status(400).json({
            message: "Invalid university data",
            error: "Validation failed",
          });
        }

        const fileName = `${university.name.toLowerCase().replace(/ /g, "-")}.json`;
        const filePath = path.join(universitiesDirectory, fileName);

        // Check if university already exists
        try {
          await fs.access(filePath);
          return res.status(409).json({
            message: "University already exists",
            error: "Duplicate entry",
          });
        } catch {
          // File doesn't exist, we can proceed
        }

        await fs.writeFile(
          filePath, 
          JSON.stringify(university, null, 2),
          { flag: 'wx' } // Write exclusively
        );
        
        res.status(201).json(university);
      } catch (error) {
        res.status(500).json({
          message: "Error creating university",
          error: error,
        });
      }
      break;

    case "PATCH":
      try {
        const { universityName, updates } = req.body;
        const fileName = `${universityName.toLowerCase().replace(/ /g, "-")}.json`;
        const filePath = path.join(universitiesDirectory, fileName);

        let existingData: University;
        try {
          const fileContents = await fs.readFile(filePath, "utf8");
          existingData = JSON.parse(fileContents);
        } catch {
          return res.status(404).json({
            message: "University not found",
            error: "Not found",
          });
        }

        const updatedData = { ...existingData, ...updates };

        // Validate the updated data
        const validateUniversity = async (data: University) => {
          const { default: Ajv } = await import("ajv");
          const { default: addFormats } = await import("ajv-formats");
          const ajv = new Ajv();
          addFormats(ajv);
          
          const schema = {
            type: "object",
            properties: {
              name: { type: "string", minLength: 3 },
              acronym: { type: "string", pattern: "^[A-Z]+$" },
              location: {
                type: "object",
                properties: {
                  city: { type: "string" },
                  state: { type: "string" }
                },
                required: ["city", "state"]
              },
              founded: { 
                type: "number",
                minimum: 1900,
                maximum: new Date().getFullYear()
              },
              website: {
                type: "string",
                format: "uri",
                pattern: "^https?://.*\\.edu\\.ng$"
              },
              faculties: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    departments: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["name", "departments"]
                }
              }
            },
            required: ["name", "acronym", "location", "founded", "website", "faculties"]
          };

          const validate = ajv.compile(schema);
          return validate(data);
        };
        const isValid = await validateUniversity(updatedData);
        
        if (!isValid) {
          return res.status(400).json({
            message: "Invalid university data",
            error: "Validation failed",
          });
        }

        // Write to a temporary file first, then rename
        const tempPath = `${filePath}.tmp`;
        await fs.writeFile(tempPath, JSON.stringify(updatedData, null, 2));
        await fs.rename(tempPath, filePath);

        res.status(200).json(updatedData);
      } catch (error) {
        res.status(500).json({
          message: "Error updating university",
          error: error,
        });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

