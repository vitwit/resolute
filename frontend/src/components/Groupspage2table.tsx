import React from "react";
import Image from 'next/image';

const Groupspage2table = () => {
    const tableData = [
        {
            address: "cosmos1eu0dnejv8v..",
            weight: "01",
            name: "Hemanth Sai Venkata Redyy Rao",
        },
        {
            address: "cosmos1eu0dnejv8v..",
            weight: "01",
            name: "Hemanth Sai Venkata Redyy Rao",
        },
        {
            address: "cosmos1eu0dnejv8v..",
            weight: "01",
            name: "Hemanth Sai Venkata Redyy Rao",
        },
        {
            address: "cosmos1eu0dnejv8v..",
            weight: "01",
            name: "Hemanth Sai Venkata Redyy Rao",
        },

    ];

    return (

        <div className='custom-group-table'>
            <div className='table-main'>
                <div className='table-main-text'>Members</div>
                <button className='updatemembers'>Update Members</button>
            </div>
            <div>
                <table className='customGrouptable'>
                    <thead className='Grouptablehead mb-9'>
                        <tr className='text-left'>
                            <th>Address</th>
                            <th>Weight</th>
                            <th>Name</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tableData.map((row, index) => (

                            <tr key={index} className="py-6">
                                <td>
                                    <div className="my-3 flex gap-2">
                                        {row.address}
                                        <Image src="/copy.svg" width={24} height={24} alt="copy" />
                                    </div>
                                </td>
                                <td>{row.weight}</td>
                                <td>{row.name}</td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Groupspage2table;
