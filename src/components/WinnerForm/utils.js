import { showError } from "../../common/toast";

export const validateCsv = (csvFile, onSuccess) => {
  if (csvFile.type !== "text/csv") {
    showError("File must be a CSV!");
    return false;
  }

  onSuccess(csvFile);
};
