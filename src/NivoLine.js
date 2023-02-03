import { ResponsiveLine } from '@nivo/line'
import { useEffect, useState } from 'react';
import axios from 'axios';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function getNewPrice(price) {
  let nPrice = Math.round(price / 1000) * 1000
  nPrice = nPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return nPrice
}


function PriceChart({ data, a /* see data tab */ }){
  let cred = localStorage.getItem('googleAccount')
  let [showChart, setShowChart] = useState(false)
  useEffect(() => {
    if (cred != undefined){
      axios.post("https://api.fleaman.shop/user/login", {
        google_token: cred
      }).then(function (response) {
        let user_data = response.data;
        if (user_data.level >= 2){
          setShowChart(true)
        }
      }).catch(function (error) {
        alert('유저 정보를 가져오는데 실패했습니다.');
      });
    }
  }, [])

  return(
    <div>
      <div style={{ color: a == "light" ? "black" : 'white'}}>
        {showChart ? "일자 별 시세 차트" : "레벨 2 이상부터 일자 별 시세 차트 확인 가능"}
      </div>
    
    <div 
      className={showChart ? null: "blurEffect"} 
      style={{ 
        width: '100%', 
        height: '200px', 
        margin: '0 auto',
        backgroundColor: a == 'light' ? null : '#343a40'
      }}
    >
      <ResponsiveLine
          data={data}
          margin={{ top: 10, right: 10, bottom: 10, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              // stacked: true,
              reverse: false
          }}
          yFormat=" >-.2f"
          curve="cardinal"

          axisTop={null}
          axisRight={null}
          colors={{ scheme: 'set1' }}
          
          pointSize={5}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={showChart ? true : false}
          theme={{textColor: a == 'light' ? null : "white"}}
          enableSlices="x"
          sliceTooltip={({ slice }) => {
            if (showChart){
              return (
                  <div
                      style={{
                          background: 'white',
                          padding: '9px 12px',
                          border: '1px solid #ccc',
                      }}
                  >
                    {/* <div>날짜: {slice.points.data[0].xFormatted}</div> */}
                      {slice.points.map((point, idx) => (
                        <div>
                          {idx == 0 ? <div>날짜: {point.data.xFormatted}</div> : null}
                          <div
                              key={point.id}
                              style={{
                                  color: point.serieColor,
                                  padding: '3px 0',
                              }}
                          >
                              <strong>{point.serieId}: </strong> {getNewPrice(point.data.yFormatted)}원
                          </div>
                        </div>
                      ))}
                  </div>
              )
            }
        }}
      />
    </div>
    </div>
  )

}

export default PriceChart;