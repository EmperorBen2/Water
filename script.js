async function openPlaid() {
    const response = await fetch('http://localhost:5000/create_link_token');
    const data = await response.json();

    const handler = Plaid.create({
        token: data.link_token,
        onSuccess: async (public_token) => {
            await fetch('http://localhost:5000/get_access_token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ public_token }),
            });
            alert('Plaid linked successfully!');
        },
    });

    handler.open();
}

async function fetchTransactions() {
    const response = await fetch('http://localhost:5000/get_transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    const transactions = await response.json();
    console.log('Transactions:', transactions);

    let output = '<h3>Recent Transactions</h3>';
    transactions.forEach(txn => {
        output += `<p>${txn.date} - ${txn.name}: $${txn.amount}</p>`;
    });

    document.getElementById('transactions').innerHTML = output;
}

document.getElementById('connectPlaid').addEventListener('click', openPlaid);
document.getElementById('fetchTransactions').addEventListener('click', fetchTransactions);
