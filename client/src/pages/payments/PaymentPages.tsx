import { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

const PaymentsPage = () => {
  const [amount, setAmount] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/payments/history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setTransactions(res.data);
  };

  const deposit = async () => {
    await axios.post(
      "http://localhost:5000/api/payments/deposit",
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchHistory();
  };

  const withdraw = async () => {
    await axios.post(
      "http://localhost:5000/api/payments/withdraw",
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <h1>Payments</h1>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={deposit}>Deposit</button>
        <button onClick={withdraw}>Withdraw</button>
      </div>

      <h2>Transaction History</h2>
      <ul>
        {transactions.map((t) => (
          <li key={t._id}>
            {t.type} - ${t.amount} - {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentsPage;