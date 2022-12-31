const HOST = 'http://localhost:3001';

const enumStatusProduct = {
  selling: {
    name: 'Đang bán',
    nameEng: 'Selling',
    code: 1,
  },
  outOfStock: {
    name: 'Đã bán hết',
    nameEng: 'Out of stock',
    code: 2,
  },
  deleted: {
    name: 'Đã xóa',
    nameEng: 'Deleted',
    code: 3,
  }
}

const enumStatusOrder = {
  pending: {
    name: 'Đang chờ xử lý',
    nameEng: 'Pending',
    code: 1,
  },
  shipping: {
    name: 'Đang giao hàng',
    nameEng: 'shipping',
    code: 2,
  },
  taken: {
    name: 'Đã nhận hàng',
    nameEng: 'taken',
    code: 3,
  },
  canceled: {
    name: 'Đã hủy',
    nameEng: 'Canceled',
    code: 4,
  }
}

module.exports = { HOST, enumStatusOrder, enumStatusProduct };
