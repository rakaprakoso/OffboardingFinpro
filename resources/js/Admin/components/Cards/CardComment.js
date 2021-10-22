import React, { useEffect, useState } from "react";
import Moment from "react-moment";

export default function CardComment({ data }) {
    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg border border-gray-50">
                <div className="p-6">
                    <h3
                        className="font-semibold text-lg text-blueGray-700 mb-2 relative flex items-center"
                    >
                        Comments <span className="ml-2 inline-block bg-red-600 text-white rounded-full w-6 h-6 text-center text-sm" style={{lineHeight:'24px'}}>{data?.length}</span>
                    </h3>
                    <div className="block w-full overflow-x-auto max-h-96">
                        {data?.map((item, i) => (
                            <div className="border p-2 rounded mb-2">
                                <h4 className="font-semibold">{item.from} <span className="text-xs"><Moment format="DD MMMM YYYY - hh:mm">{item.created_at}</Moment></span></h4>
                                <p className="mb-0">{item.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
