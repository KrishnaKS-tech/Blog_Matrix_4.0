import React, { useState } from "react";
import axios from "axios";

function SignUpForm() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  });
  // const [data, setData] = useState([]);

  // Handle input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/signupdata",
        form
      );
      alert(res.data.message); // ✅ Show backend message (success)
      setForm({ firstname: "", lastname: "", username: "", password: "" });
      // fetchData();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // ✅ e.g. "User already exists"
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  // Fetch all users (for debug / display)
  // const fetchData = async () => {
  //   const res = await axios.get("http://localhost:5000/api/signupdata");
  //   setData(res.data);
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full mr-16 ml-16">
      <h1 className="text-3xl text-teal-500 mb-4">Sign Up</h1>

      <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit}>
        <div className="flex gap-4 w-full justify-between">
          <input
            name="firstname"
            value={form.firstname}
            type="text"
            className="border border-gray-300 p-4 w-full"
            placeholder="First Name"
            onChange={handleChange}
          />
          <input
            name="lastname"
            value={form.lastname}
            type="text"
            className="border border-gray-300 p-4 w-full"
            placeholder="Last Name"
            onChange={handleChange}
          />
        </div>

        <input
          name="username"
          value={form.username}
          type="text"
          className="border border-gray-300 p-4"
          placeholder="Create Username"
          onChange={handleChange}
        />

        <input
          name="password"
          value={form.password}
          type="password"
          className="border border-gray-300 p-4"
          placeholder="Create Password"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-teal-500 text-white p-3 text-2xl cursor-pointer hover:bg-teal-600"
        >
          Submit
        </button>

        <p className="flex justify-center items-center text-2xl">
          Already have an account? &nbsp;
          <span className="text-teal-500 cursor-pointer">Login Here</span>
        </p>
      </form>
    </div>
  );
}

export default SignUpForm;
