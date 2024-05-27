import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [empData, setEmpData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    supplierName: "",
    paymentTerms: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://suplierdatabackend-2.onrender.com/api/v1/getallUsers"
        );
        const data = response.data.data;
        setEmpData(data);
        console.log("your data", data)
      } catch (error) {
        console.error("Error fetching data:", error);
        setEmpData([]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      handleFileUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".csv",
  });

  const handleFileUpload = async (file) => {
    if (!file) {
      setMessage("Please select a file to upload.");
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("csvfile", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://suplierdatabackend-2.onrender.com/api/v1/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data);
      toast.success("File uploaded successfully!");
      setEmpData(response.data.data);
      window.location.href = '/';
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error in uploading file: " + error.message);
      toast.error("Error in uploading file: " + error.message);
      setEmpData([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = async () => {
    const { supplierName, paymentTerms } = newSupplier;
    if (supplierName === "" || paymentTerms === "") {
      toast.error("Both fields are required");
      return;
    }

    try {
      const response = await axios.post("https://suplierdatabackend-2.onrender.com/api/v1/createUser", {
        supplierName,
        paymentTerms
      });

      if (response.status === 200) {
        toast.success("Supplier added successfully");
        setEmpData([...empData, response.data]);
        closeModal();
        window.location.href = '/homepage';
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error("Error adding supplier: " + error.message);
    }
  };

  const filteredData = empData.filter((person) => {
    return (
      person["suppliername"] &&
      person["suppliername"].toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const navigate = useNavigate();
  const LogOut = () => {
    localStorage.removeItem('token');
    navigate("/");
  }

  return (
    <div>
      <section className="container px-4 mx-auto py-4">
        <ToastContainer />
        <div className="flex flex-col space-y-4">
          <Link>
            <button onClick={LogOut} className="border-red-400 rounded-md bg-indigo-600 text-white hover:text-black hover:bg-red-400 flex items-center justify-center space-x-2 ">
              <i className="fas fa-sign-out-alt"></i>
              <span>Log Out</span>
              <IoLogOut />
            </button>
          </Link>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="loader"></div>
            </div>
          ) : (
            empData.length === 0 ? (
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center w-full h-96 rounded-md cursor-pointer border-2 border-dotted ${
                  isDragActive ? "border-indigo-600" : "border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-indigo-600 text-center">Drop the file here...</p>
                ) : (
                  <p className="text-gray-500 text-center">
                    Drag 'n' drop a CSV file here, or click to select one
                  </p>
                )}
              </div>
            ) : (
              <>
                <div
                  {...getRootProps()}
                  className={`w-full p-14 rounded-md cursor-pointer border-2 border-dotted ${
                    isDragActive ? "border-indigo-600" : "border-gray-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-indigo-600 text-center">Drop the file here...</p>
                  ) : (
                    <p className="text-gray-500 text-center">
                      Drag 'n' drop a CSV file here, or click to select one
                    </p>
                  )}
                </div>
                <div
                  style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
                >
                  <button
                    onClick={openModal}
                    className="w-full rounded-md bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold leading-7 text-white hover:bg-indigo-500"
                  >
                    Add Supplier
                  </button>
                </div>
                <div>
                  <div className="flex mt-9">
                    <input
                      type="text"
                      placeholder="Search by name"
                      value={searchQuery}
                      onChange={handleSearch}
                      className="p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div className="flex flex-col mt-6">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                  Supplier Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                  Payment Terms
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                              {displayedData.map((supplier, index) => (
                                <tr key={index}>
                                  <td className="px-12 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                      {supplier.suppliername}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {supplier.paymentterm}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </>
            )
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add Supplier
                    </h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="supplierName"
                        value={newSupplier.supplierName}
                        onChange={handleInputChange}
                        placeholder="Supplier Name"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="paymentTerms"
                        value={newSupplier.paymentTerms}
                        onChange={handleInputChange}
                        placeholder="Payment Terms"
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddSupplier}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 40px;
          height: 40px;
          -webkit-animation: spin 2s linear infinite;
          animation: spin 2s linear infinite;
        }

        @-webkit-keyframes spin {
          0% { -webkit-transform: rotate(0deg); }
          100% { -webkit-transform: rotate(360deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
