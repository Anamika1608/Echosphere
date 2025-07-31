import { Link } from "react-router-dom";
import NotFoundPic from '../../assets/NotFoundPic.png'

export default function NotFound() {
  return (
    <div className="flex flex-col bg-[#F9F7F5] items-center justify-center min-h-screen bg-gray-50 px-4">
      <img src={NotFoundPic} alt="404 Not Found" />

      <Link
        to="/"
        className="mt-6 px-6 py-2 text-white bg-orange-500 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
