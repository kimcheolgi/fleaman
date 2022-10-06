let data = [
  {
    category: "macbookair",
    item : "M1",
    nowPage: 1,
    totalPage: 10,
    contents : 
      [1,2,3,4,5,6,7,8,9,10,11,12].map((no, idx)=>{
      return (
        {
          id: no,
          image: 'https://media.bunjang.co.kr/product/200821868_1_1664634630_w512.jpg',
          name: 'macbook m1 급처합니다',
          state: '판매중',
          price: 820000,
          like: 332,
          comments: 10,
          source: '번개장터',
          date: '2022-10-01'
        }
      )
    })
    
  }
]

export default data;