import React from "react";

export default function CardEmployee({data}) {
    console.log(data);
    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16 lg:mt-0 border border-gray-50">
                <div className="p-6">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold leading-normal mb-4 text-blueGray-700">
                            {data.employee.name}
                        </h3>
                        <div className="mb-2 text-blueGray-600">
                            <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                            Position - Division
                        </div>
                        <div className="mb-2 text-blueGray-600">
                            <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                            Unit Kerja
                        </div>
                    </div>
                    <div className="mt-10 py-4 border-t border-blueGray-200 text-center">
                        <div className="flex flex-wrap justify-center">
                            <div className="w-full lg:w-9/12 px-4">
                                <p className="text-lg leading-relaxed text-blueGray-700">
                                  <strong>Reason :</strong>
                                </p>
                                <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                                   {data.details.reason}
                                </p>
                                <p className="text-lg leading-relaxed text-blueGray-700">
                                  <strong>Attachment :</strong>
                                </p>
                                <a
                                    download
                                    href={data.details.resignation_letter_link}
                                    className="font-normal text-lightBlue-500 border rounded p-2"
                                >
                                    <i className="fas fa-file mr-2 text-lg"></i>
                                    Resignation Letter
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
