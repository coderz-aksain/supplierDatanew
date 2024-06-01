import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";

const HomePage = () => {
  const [empData, setEmpData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    supplierName: "",
    paymentTerms: "",
  });
  const [currentEditSupplier, setCurrentEditSupplier] = useState({
    id: "",
    supplierName: "",
    paymentTerms: "",
  });
  // console.log("your state id" , id);
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
        console.log("your data", data);
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
      window.location.href = "/";
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

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (supplier) => {
    setCurrentEditSupplier({
      _id: supplier._id,
      supplierName: supplier.suppliername,
      paymentTerms: supplier.paymentterm,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openDeleteModal = (id) => {
    setCurrentEditSupplier({
      _id: id,
      // supplierName: supplier.suppliername,
      // paymentTerms: supplier.paymentterm
    });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEditSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = async () => {
    const { supplierName, paymentTerms } = newSupplier;
    if (supplierName === "" || paymentTerms === "") {
      toast.error("Both fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "https://suplierdatabackend-2.onrender.com/api/v1/createUser",
        {
          supplierName,
          paymentTerms,
        }
      );

      if (response.status === 200) {
        toast.success("Supplier added successfully");
        setEmpData([...empData, response.data]);
        closeAddModal();
        window.location.href = "/homepage";
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error("Error adding supplier: " + error.message);
    }
  };

  // const  id =  empData
  const handleEditSupplier = async (id) => {
    const { _id, supplierName, paymentTerms } = currentEditSupplier;
    console.log("Your Id ", _id);
    if (!_id) {
      console.log("Id is not present");
      return;
    }
    if (supplierName === "" || paymentTerms === "") {
      toast.error("Both fields are required");
      return;
    }

    try {
      const response = await axios.put(
        `https://suplierdatabackend-2.onrender.com/api/v1/updateuser/${_id}`,
        {
          supplierName,
          paymentTerms,
        }
      );
      console.log("This  is Your Response", response);

      if (response.status === 200) {
        toast.success("Supplier updated successfully");
        setEmpData(
          empData.map((supplier) =>
            supplier._id === _id
              ? {
                  ...supplier,
                  suppliername: supplierName,
                  paymentterm: paymentTerms,
                }
              : supplier
          )
        );
        // console.log("This is supplier id",supplier._id)
        closeEditModal();
      }
    } catch (error) {
      console.error("Error in updating supplier:", error);
      toast.error("Error  in updating supplier: " + error.message);
    }
  };

  const handleDeleteSupplier = async () => {
    const { _id } = currentEditSupplier;
    console.log(" Your Id Is", _id);

    if (_id) {
      console.log(" Your Id Is", _id);
      // return;
    }
    try {
      const response = await axios.delete(
        `https://suplierdatabackend-2.onrender.com/api/v1/deleteUser/${_id}`
      );
      console.log("Your response", response);
      if (response.status === 200) {
        toast.success("Supplier deleted successfully");
        setEmpData(empData.filter((supplier) => supplier._id !== _id));
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Error deleting supplier: " + error.message);
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
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <section className="container px-4 mx-auto py-4">
        <ToastContainer />
        <div className="flex flex-col space-y-4">
          <Link>
            <button
              onClick={LogOut}
              className="border-red-400 rounded-md bg-indigo-600 text-white hover:text-black hover:bg-red-400 flex items-center justify-center space-x-2 "
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Log Out</span>
              <IoLogOut />
            </button>
          </Link>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="loader"></div>
            </div>
          ) : empData.length === 0 ? (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center w-full h-96 rounded-md cursor-pointer border-2 border-dotted ${
                isDragActive ? "border-indigo-600" : "border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-indigo-600 text-center">
                  Drop the file here...
                </p>
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
                  <p className="text-indigo-600 text-center">
                    Drop the file here...
                  </p>
                ) : (
                  <p className="text-gray-500 text-center">
                    Drag 'n' drop a CSV file here, or click to select one
                  </p>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <button
                  onClick={openAddModal}
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
                              <th
                                scope="col"
                                className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                              >
                                Actions
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
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                  <button
                                    onClick={() => openEditModal(supplier)}
                                    className="px-2 py-1 bg-indigo-600 text-white rounded-md hover:bg-blue-600"
                                  >
                                    <AiOutlineEdit />
                                  </button>
                                  <button
                                    onClick={() =>
                                      openDeleteModal(supplier._id)
                                    }
                                    // onClick={() => handleDeleteSupplier(supplier._id)}
                                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-400"
                                  >
                                    <RiDeleteBinLine />
                                  </button>
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
          )}
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
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
                  onClick={closeAddModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Supplier
                    </h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="supplierName"
                        value={currentEditSupplier.supplierName}
                        onChange={handleEditInputChange}
                        placeholder="Supplier Name"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="paymentTerms"
                        value={currentEditSupplier.paymentTerms}
                        onChange={handleEditInputChange}
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
                  onClick={handleEditSupplier}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================== */}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Are You Sure You Want To Delete ?
                    </h3>
                  
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteSupplier}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                >
                  No
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
