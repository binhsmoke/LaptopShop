const fetchAPI = async (url, option) => {
    const res = await fetch(url, option);
    return res.json();
}

const onDelete = async (id) => {
    const url = `http://localhost:3001/${id}/delete`;
    const option = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' }
    }
    try {
        await fetchAPI(url, option);
        window.location.href = '/products';
    } catch (e) { console.log('Delete error: ', e) }
}

const onDeleteCustomer = async (id) => {
    const url = `http://localhost:3001/${id}/deleteCustomer`;
    const option = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' }
    }
    try {
        await fetchAPI(url, option);
        window.location.href = '/customers';
    } catch (e) { console.log('Delete error: ', e) }
}

const confirmOrder = async (id) => {
    const url = `http://localhost:3001/orders/${id}/status/ok`;
    const option = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
    }

    await fetchAPI(url, option).then(alert('Cập nhật trạng thái đơn hàng thành công')).then(window.location.assign('/orders')).catch(e=> console.log('err status update>>',e));

}
const cancelOrder = async (id) => {
    const url = `http://localhost:3001/orders/${id}/status/cancel`;
    const option = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
    }

    await fetchAPI(url, option).then(alert('Cập nhật trạng thái đơn hàng thành công')).then(window.location.assign('/orders')).catch(e=> console.log('err status update>>',e));

}

const pendingOrder = async (id) => {
    const url = `http://localhost:3001/orders/${id}/status/pending`;
    const option = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
    }

    await fetchAPI(url, option).then(alert('Cập nhật trạng thái đơn hàng thành công')).then(window.location.assign('/orders')).catch(e=> console.log('err status update>>',e));
}



