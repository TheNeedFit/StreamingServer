import { useState } from "react";
import "../Css/navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const backendURL = "https://vercelbackendkle.onrender.com"
  const [data, setData] = useState({});
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("light");
    return Dark ? JSON.parse(Dark) : true;
  });

  //TOASTS

  const SignupNotify = () =>
    toast.success("Signup successfull!", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
     theme: theme ? "dark" : "light",
    });

  const ErrorNotify = () =>
    toast.error("Input fields can't be empty.", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
     theme: theme ? "dark" : "light",
    });

  const EmailErrorNotify = (data) =>
    toast.error(data, {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
     theme: theme ? "dark" : "light",
    });

  const handleInputs = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitData = async (e) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.password) {
      ErrorNotify();
      return;
    }
    try {
      console.log("Response status:");

      const response = await fetch(`${backendURL}/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Response status:", response.status);
  
      // Check if the response status is OK
      if (response.ok) {
        const { message, token } = await response.json();
        if (message === "REGISTRATION SUCCESSFUL") {
          SignupNotify();
          localStorage.setItem("userToken", token);
          setTimeout(() => {
            window.location.reload();
            document.body.classList.remove("bg-class");
          }, 2000);
        } else {
          EmailErrorNotify(message);
        }
      } else {
        // Log the response text in case of an error
        console.error("Error response:", await response.text());
        throw new Error("Failed to register. Please try again.");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <>
      <div className="above-data">
        <p className="signup-head">Create Your Account</p>
        <p className="signup-desc">
          Login to Upload Videos and Delight in Seamless Video Streaming on KLE Platform. Your Gateway to Share and Enjoy a World of Engaging Content!


        </p>
      </div>
      <div className="signup-form">
        <form onSubmit={SubmitData}>
          <input
            type="text"
            name="name"
            className={
              theme
                ? "username"
                : "username email-light light-mode text-light-mode"
            }
            placeholder="Name"
            required
            onChange={handleInputs}
          />
          <input
            type="email"
            name="email"
            className={
              theme ? "email" : "email email-light light-mode text-light-mode"
            }
            placeholder="Email Address"
            required
            onChange={handleInputs}
          />
          <input
            type="password"
            name="password"
            className={
              theme
                ? "password"
                : "password email-light light-mode text-light-mode"
            }
            placeholder="Passcode"
            required
            onChange={handleInputs}
          />
          <button
            className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
            type="submit"
          >
            Create Your Account
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
