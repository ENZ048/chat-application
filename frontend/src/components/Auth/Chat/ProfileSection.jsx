import { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

const avatarSeeds = [
  "Jocelyn",
  "Nolan",
  "Eden",
  "Luis",
  "Andrea",
  "Christopher",
  "Kingston",
  "Wyatt",
  "Adrian",
  "Mason",
  "Oliver",
  "Ryker",
  "Aiden",
  "Sophia",
  "Katherine",
  "Riley",
];

export default function ProfileSection() {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("you@gmail.com");
  const [selectedSeed, setSelectedSeed] = useState(avatarSeeds[0]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("user/me");
        const { firstName, lastName, email, avatar } = res.data.user;
        setFirstname(firstName);
        setLastname(lastName);
        setEmail(email);

        const seedMatch = avatar?.match(/seed=([^&]+)/);
        if (seedMatch) {
          selectedSeed(seedMatch[1]);
        }

      } catch (error) {
        console.log(error);
        toast.error("Failed to load user data");
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        firstName,
        lastName,
        avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${selectedSeed}&radius=50&backgroundColor=c0aede`,
      };

      await axios.put("/user/profile", formData);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center mb-8">
          Update Profile
        </h1>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="firstName"
                className="text-white text-sm md:text-lg font-bold"
              >
                First Name
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstname(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white p-2 px-4 rounded"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastName"
                className="text-white text-sm md:text-lg font-bold"
              >
                Last Name
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastname(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white  p-2 px-4 rounded"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white text-sm md:text-lg font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="bg-gray-700 border-gray-600 text-gray-400  p-2 px-4 rounded"
            />
          </div>

          <div className="flex flex-col gap-6">
            <label className="text-white text-lg font-bold">
              Choose Avatar
            </label>
            <div className="grid grid-cols-4 gap-3">
              {avatarSeeds.slice(0, 8).map((seed) => (
                <img
                  key={seed}
                  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&radius=50&backgroundColor=c0aede`}
                  alt={seed}
                  className={`w-16 h-16 rounded-full cursor-pointer border-4 ${
                    selectedSeed === seed
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedSeed(seed)}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-8 p-2 rounded cursor-pointer"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
