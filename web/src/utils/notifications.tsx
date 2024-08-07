import toast from "react-hot-toast";

export function SendSuccessNotification(message: string) {
  toast.success(message, {
    style: {
      border: "2px solid #17181f",
      color: "#17181f",
      backgroundColor: "#f5f5f5",
      fontSize: "18px",
      borderRadius: "5px",
      boxShadow: "0px 0px 5px 0px #17181f",
    },
    duration: 4000,
    iconTheme: {
      primary: "yellowgreen",
      secondary: "#17181f",
    },
  });
}

export function SendErrorNotification(message: string) {
  toast.error(message, {
    style: {
      border: "2px solid #17181f",
      color: "#17181f",
      backgroundColor: "#f5f5f5",
      fontSize: "18px",
      borderRadius: "5px",
      boxShadow: "0px 0px 5px 0px #17181f",
    },
    duration: 4000,
    iconTheme: {
      primary: "red",
      secondary: "#17181f",
    },
  });
}
