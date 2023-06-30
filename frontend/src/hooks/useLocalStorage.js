import { decodeToken } from "react-jwt";

function useLocalStorage() {
  const userInStorage = localStorage.getItem("user");
  let decoded = null;

  try {
    if (userInStorage) {
      decoded = decodeToken(JSON.parse(userInStorage)?.jwt);
    }
  } catch (error) {
    console.error("There was an error decoding the token:", error);
  }

  return { decoded, userInStorage };
}

export default useLocalStorage;

