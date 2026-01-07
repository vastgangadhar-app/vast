import { APP_URLS } from "../utils/network/urls";


export const fetchSalarySummary = async (post: any, month: number, year: number) => {
  const url = `${APP_URLS.RCETotalSalary}?Month=${month}&Year=${year}`;
  console.log("Salary Summary URL:", url);
  return post({ url });
};

export const fetchSalaryDetails = async (post: any, rceId: string, month: number, year: number) => {
  const url = `${APP_URLS.RCETotalSalaryDetails}?RCEID=${rceId}&Month=${month}&Year=${year}`;
  console.log("Salary Details URL:", url);
  return post({ url });
};