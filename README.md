# ng-universities

This is a public API of comprehensive, community-driven database of Nigerian universities, their faculties, and departments.

## How to Contribute

**Data Format**:
   - Create a new JSON file in the `data/universities/` folder
   - Name the file using the university's lowercase name with hyphens (e.g., `kwara-state-university.json`)
   - Follow the standard JSON structure provided in the third section below


**Contribution Steps**:
   1. Fork the repository. You can learn how to do that by watching this [video](https://www.youtube.com/watch?v=-9ftoxZ2X9g)
   2. Clone the repository with this command `git clone https://github.com/<YOUR-GITHUB-USERNAME>/ng-universities`
   3. Move into the directory with this command `cd ng-universities`
   5. Create a new branch (`git checkout -b add-university-data`)
   5. Add your university JSON file or edit a pre-existing university file with more info
   6. Run the data validation script with this command: `pnpm run validate-unis`.
   You can also decide to validate a specific file instead of running the validation script on the entire university data by doing the following:
   ```shell
   pnpm run validate-unis --file kwara-state-university
   ```

   Or on a set of files like this:

   ```shell
   pnpm run validate-unis --file university-of-lagos,ekiti-state-university
   ```
   7. Commit your changes with this command: `git commit -m "a message indicating what you've done"`
   8. Create a Pull Request. [Watch this](https://www.youtube.com/watch?v=nCKdihvneS0)

### Data Validation

Before submitting:
- Ensure all required fields are filled
- Validate JSON structure
- Check for accuracy of information

If you forget to do this, do not fret. The CI workflow will help us detect it in your PR.

Below is an example structure we're looking for.

```json
{
  "logo": "",
  "current_vc": "",
  "name": "Full University Name",
  "acronym": "Acronym",
  "location": {
    "city": "City Name",
    "state": "State Name"
  },
  "founded": 1900,
  "website": "https://university.edu.ng",
  "faculties": [
    {
      "acronym": "Acronym",
      "name": "Faculty Name",
      "departments": [
        { "acronym": "department acronym", "name": "department name" },
        { "acronym": "department acronym", "name": "department name" }
      ]
    }
  ]
}
```

You can find a couple of university logos [here](https://myschoolportal.net/blog/nigerian-university-logos/)

---

### **Troubleshooting Guide**:

1. This project uses `pnpm` for package management. If you don't have it installed, you can do so by running the following command:

   ```shell
   npm install -g pnpm
   ```

   Alternatively, you can follow the [comprehensive installation guide](https://pnpm.io/installation).

2. If you've mistakenly used `npm`, `yarn`, or any other package manager, please follow these steps:
   - Delete the `node_modules` folder and any lock files (e.g., `package-lock.json`, `yarn.lock`, etc.).
   - Reinstall the packages using `pnpm` by running:

     ```shell
     pnpm install
     ```

3. To ensure you're working with the latest version of the project and avoid conflicts, make sure your forked repository is up to date with the main repo. Here's how:
   - Navigate to your forked repo at `https://github.com/<YOUR-GITHUB-USERNAME>/ng-universities`.
   - Click on the `Sync Fork` button and then click `Update Branch`:
     ![image](https://github.com/user-attachments/assets/ac723dcf-7ffc-4172-a833-891a641e6799)

4. It's always a good idea to check the `README` page for any recent changes or updates.

---


## License
[MIT](LICENSE)
