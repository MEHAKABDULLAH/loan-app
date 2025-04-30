import React, { useEffect, useState } from "react";
import { Form, Select, InputNumber, Button, Input, Table, Space, Popconfirm, message, Card } from "antd";
import axios from "axios";

const { Option } = Select;

const LoanCalculator = () => {
  const categories = {
    wedding: ["Valima", "Furniture", "Valima Food", "Jahez"],
    home: ["Structure", "Finishing", "Loan"],
    business: ["Buy Stall", "Advance Rent for Shop", "Shop Assets", "Shop Machinery"],
    education: ["University Fees", "Child Fees Loan"],
  };

  const [subCategories, setSubCategories] = useState([]);
  const [form] = Form.useForm();
  const [loanData, setLoanData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [userDetails, setUserDetails] = useState({ email: "", nic: "" });

  const fetchLoans = async () => {
    const res = await axios.get("https://backhend-sage.vercel.app/api/loans");
    setLoanData(res.data);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const onCategoryChange = (value) => {
    setSubCategories(categories[value]);
    form.setFieldsValue({ subCategory: undefined });
  };

  const calculateInstallment = (amount, deposit, period) => {
    return ((amount - deposit) / (period * 12)).toFixed(2);
  };

  const onFinish = async (values) => {
    const calculatedInstallment = calculateInstallment(values.loanAmount, values.initialDeposit, values.loanPeriod);
    const data = {
      ...values,
      ...userDetails,
      monthlyInstallment: calculatedInstallment,
    };

    try {
      if (editingId) {
        await axios.put(`https://backhend-sage.vercel.app/api/loans/${editingId}`, data);
        window.alert("Loan updated successfully");
      } else {
        await axios.post("https://backhend-sage.vercel.app/api/loans", data);
        window.alert("Loan submitted successfully");
      }

      form.resetFields();
      setUserDetails({ email: "", nic: "" });
      setEditingId(null);
      fetchLoans();
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://backhend-sage.vercel.app/api/loans/${id}`);
   window.alert("Loan deleted");
    fetchLoans();
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setUserDetails({ email: record.email, nic: record.nic });
    setEditingId(record._id);
    setSubCategories(categories[record.category]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <Button onClick={() => handleEdit(record)} type="link">Edit</Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record._id)}>
            <Button danger type="link">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <Card title={editingId ? "Edit Loan" : "New Loan"} bordered={false} style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select Category" onChange={onCategoryChange}>
              {Object.keys(categories).map((cat) => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="subCategory" label="Sub Category" rules={[{ required: true }]}>
            <Select placeholder="Select Sub Category" disabled={!subCategories.length}>
              {subCategories.map((sub) => (
                <Option key={sub} value={sub}>{sub}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="loanAmount" label="Loan Amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="initialDeposit" label="Initial Deposit" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="loanPeriod" label="Loan Period (Years)" rules={[{ required: true }]}>
            <Select placeholder="Select Period">
              {Array.from({ length: 30 }, (_, i) => (
                <Option key={i + 1} value={i + 1}>{i + 1} Year(s)</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Email" required>
            <Input value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} />
          </Form.Item>

          <Form.Item label="NIC" required>
            <Input value={userDetails.nic} onChange={(e) => setUserDetails({ ...userDetails, nic: e.target.value })} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingId ? "Update Loan" : "Submit Loan"}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* <Table dataSource={loanData} rowKey="_id" columns={columns} pagination={{ pageSize: 5 }} /> */}
    </div>
  );
};

export default LoanCalculator;
