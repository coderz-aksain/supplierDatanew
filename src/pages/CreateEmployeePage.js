import React from "react";
import { Link } from "react-router-dom";
import { FaBackward } from "react-icons/fa";
import EmployeeForm from "../components/EmployeeForm";

const CreateEmployeePage = () => {
  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
          <div className="absolute inset-0">
            <img
              className="h-full w-full object-cover object-top"
              src="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

          <div className="relative">
            <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
              <h3 className="text-4xl font-bold text-white">
                Manage Your Business With Your Supplier Data!
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-black text-center dark:text-white sm:text-4xl">
              LOGIN
            </h2>

            <EmployeeForm />
          </div>
        </div>
      </div>
      <footer className="bg-gradient-to-r from-indigo-600 to-black py-4 mt-56 ">
        <div className="text-center text-white">
          Designed and Developed by Coderz-Ayush with ❤️
        </div>
      </footer>
    </section>
  );
};

export default CreateEmployeePage;
