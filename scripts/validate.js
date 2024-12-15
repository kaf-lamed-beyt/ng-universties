import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { argv } from "node:process";

// since we're using `type:module`, we should get the directory path equivalent to __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const universitySchema = {
  type: "object",
  properties: {
    logo: {
      type: "string",
      format: "uri",
      pattern: "^https?://.*$",
    },
    current_vc: {
      type: "string",
      minLength: 0,
      maxLength: 250,
    },
    name: {
      type: "string",
      minLength: 3,
      maxLength: 200,
    },
    acronym: {
      type: "string",
      minLength: 2,
      maxLength: 10,
      pattern: "^[A-Z]+$",
    },
    type: {
      type: "string",
      enum: ["federal", "state", "private"],
    },
    location: {
      type: "object",
      properties: {
        city: {
          type: "string",
          minLength: 2,
          maxLength: 100,
        },
        state: {
          type: "string",
          minLength: 2,
          maxLength: 100,
        },
      },
      required: ["city", "state"],
    },
    founded: {
      type: "number",
      minimum: 1900,
      maximum: new Date().getFullYear(),
    },
    website: {
      type: "string",
      format: "uri",
      pattern: "^https?://.*\\.edu\\.ng$",
    },
    faculties: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 3,
            maxLength: 200,
          },
          acronym: {
            type: "string",
            minLength: 0,
            maxLength: 20,
          },
          departments: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              properties: {
                acronym: {
                  type: "string",
                  minLength: 0,
                  maxLength: 20,
                },
                name: {
                  type: "string",
                  minLength: 2,
                  maxLength: 200,
                },
              },
            },
          },
        },
        required: ["name", "departments"],
      },
    },
  },
  required: ["name", "acronym", "location", "founded", "website", "faculties"],
  additionalProperties: false,
};

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(universitySchema);

function validateUniversityFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const universityData = JSON.parse(fileContent);
    const valid = validate(universityData);
    if (!valid) {
      console.error(`Validation errors in ${path.basename(filePath)}:`);
      console.error(validate.errors);
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      `Error processing ${path.basename(filePath)}:`,
      error.message
    );
    return false;
  }
}

function validateUniversity() {
  const universitiesDir = path.join(__dirname, "..", "data", "universities");
  const universityFiles = fs
    .readdirSync(universitiesDir)
    .filter((file) => file.endsWith(".json"));

  let allValid = true;
  const option = argv[2];

  let filesToValidate = [];
  if (option === "--file") {
    const fileName = argv[3];
    if (!fileName) {
      console.error("You need to provide a filename with this option");
      process.exit(1);
    }

    filesToValidate = fileName
      .split(",")
      .map((file) => path.join(universitiesDir, `${file.trim()}.json`));
  } else {
    filesToValidate = universityFiles.map((file) =>
      path.join(universitiesDir, file)
    );
  }

  filesToValidate.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const isValid = validateUniversityFile(filePath);

    if (!isValid) {
      allValid = false;
      console.error(`❌ ${fileName} - INVALID`);
    } else {
      console.log(`✅ ${fileName} - VALID`);
    }
  });

  process.exit(allValid ? 0 : 1);
}

validateUniversity();
