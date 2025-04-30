import React, { useEffect, useState } from "react";
import { Table, Space, Button, Popconfirm, message, Card } from "antd";
import axios from "axios";

const Dashboard = () => {
  const [loanData, setLoanData] = useState([]);

  const fetchLoans = async () => {
    try {
      const res = await axios.get("https://backhend-sage.vercel.app/api/loans");
      setLoanData(res.data);
    } catch (err) {
      message.error("Failed to load loans");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://backhend-sage.vercel.app/api/loans/${id}`);
    message.success("Loan deleted");
    fetchLoans();
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const columns = [
    { title: "Category", dataIndex: "category" },
    { title: "Sub Category", dataIndex: "subCategory" },
    { title: "Amount", dataIndex: "loanAmount" },
    { title: "Deposit", dataIndex: "initialDeposit" },
    { title: "Period", dataIndex: "loanPeriod" },
    { title: "Installment", dataIndex: "monthlyInstallment" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          {/* Only admin will see these buttons */}
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record._id)}>
            <Button danger type="link">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "auto" }}> <h1>Admin Dashboard</h1>
      <Card title="Admin Dashboard - All Loan Applications">
        <Table dataSource={loanData} columns={columns} rowKey="_id" />
      </Card>
    </div>
  );
};

export default Dashboard;
