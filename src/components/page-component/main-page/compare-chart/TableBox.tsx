import { presentParsing } from "@/utils/presentParsing";
import Image from "next/image";
import React, { JSX, memo } from "react";

function TableBox() {
  const baseItem = {
    name: '유쓰 5G 데이터 플러스',
    monthlyFee: 75000,
    baseDataGb: -1,
    voiceCallPrice: 400,
    sms: '기본 제공',
    present: '넷플릭스/티빙/웨이브 택 1,네이버 페이 매월 20000원 제공'
  }

  const compareItem = {
    name: '유쓰 5G 데이터 플러스2',
    monthlyFee: 65000,
    baseDataGb: 100,
    voiceCallPrice: 500,
    sms: '기본 제공',
    present: '네이버 페이 매월 20000원 제공'
  }
  
  const labelList = {
    name: '이름',
    monthlyFee: '월정액',
    baseDataGb: '데이터',
    voiceCallPrice: '음성통화',
    sms: '문자',
    present: '혜택',
  };

  const itemList = Object.keys(labelList).map((key) => {
    const label = labelList[key as keyof typeof labelList];
    const base = baseItem[key as keyof typeof baseItem];
    const compare = compareItem[key as keyof typeof compareItem];

    let unit = '원';
    if (key === 'baseDataGb') unit = 'Gb';
    if (key === 'voiceCallPrice') unit = '원(1초 당)';

    //일괄적으로 쓰는 표현 함수
    const getDisplayValue = (value: string | number): string | JSX.Element => {
      if ((key === 'baseDataGb' || key === 'voiceCallPrice') && value === -1) {
        return '무제한';
      }
      if (key === 'present') {
        const arr = presentParsing(String(value));
        return (<div className="w-full">
          {arr.map((item, idx) => (
            <p key={idx}>{item}</p>
          ))}
        </div>);
      }
      if (typeof value === 'number') {
        return value.toLocaleString() + unit;
      }
      return String(value);
    };
    
    //base, compare 값이 number일 때, 비교하는 함수
    const getDiffValue = (base: number, compare: number): JSX.Element => {
      const isCompare = compare > base;
      const icon = isCompare ? "/increase.svg" : "/decrease.svg";
      const diff = isCompare ? (Number(compare) - Number(base)).toLocaleString() : (Number(base) - Number(compare)).toLocaleString();

      return(
        <div className="flex flex-row items-center justify-center w-full">
          <Image src={icon} alt="diff" width={18} height={18} />
          {diff}{unit}
        </div>);
    }

    //compare result 함수
    const getResult = (): JSX.Element => {
      if (base === compare) {
        return <p>-</p>;
      }
      else if (key === 'monthlyFee') {
        return getDiffValue(Number(base), Number(compare));
      }
      else if (key === 'baseDataGb' || key === 'voiceCallPrice') {
        if (base === -1) return <p>무제한 → {compare}{unit}</p>;
        else if (compare === -1) return <p>{base}{unit} → 무제한</p>;
        else return getDiffValue(Number(base), Number(compare));
      }
      else if (key === 'sms') {
        return <p>{base} → {compare}</p>;
      }
      else if (key === 'present') {
        const baseArr = presentParsing(String(base));
        const compareArr = presentParsing(String(compare));
        
        return (
          <div>
            {baseArr.filter((item) => !compareArr.includes(item)).map((baseItem, idx) => (
              <s key={idx}>{baseItem}</s>
            ))}
            {compareArr.map((compareItem, idx) => (
              <p key={idx}>{compareItem}</p>
            ))}
          </div>);
      }
      else {
        return <p>-</p>;
      }
    };
    
    return {
      label,
      base: getDisplayValue(base),
      compare: getDisplayValue(compare),
      result: getResult(),
    };
  })

  return (
    <>
    <table className="w-full h-[60px] table-fixed text-center">
    <thead>
      <tr className="font-bold text-lg">
        <th>기준 요금제</th>
        <th></th>
        <th>비교 요금제</th>
      </tr>
      </thead>
      </table>
      <div className="rounded-[20px] overflow-hidden border-[var(--color-gray-20)] border-[1px]">
        <table className="w-full table-fixed text-center rounded-[20px] overflow-hidden border-collapse">
          <tbody>
            {itemList.map((item, idx) => (
              <React.Fragment key={idx}>
                <tr className="bg-[var(--color-gray-20)] h-[60px]">
                  <td></td>
                  <td className="font-bold text-lg">{item.label}</td>
                  <td></td>
                </tr>
                <tr className="bg-white text-lg">
                  <td className={item.label === '혜택' ? "py-[40px]" : "py-[20px]"}>{item.base}</td>
                  <td className={item.label === '혜택' ? "py-[40px] border-[var(--color-gray-20)] border-x-[1px]" : "py-[20px] border-[var(--color-gray-20)] border-x-[1px]"}>{item.result}</td>
                  <td className={item.label === '혜택' ? "py-[40px]" : "py-[20px]"}>{item.compare}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default memo(TableBox);