export const transformEmailData = (formDataOrderDto: any) => {
    console.log("formDataOrderDto______", formDataOrderDto);
    
    const {
        name,
        phone,
        products,
        delivery,
        deliveryTime,
        totalPrice,
        sdacha,
        chopsticks,
        comments
      } = formDataOrderDto

        const dataOrder =  products;
        console.log("dataOrder___ products", dataOrder);
        // console.log("formDelivery___", formDelivery);
        
        const orderList = products.map((elem: any) => {
            const isWokDescritp = elem.descriptionWok === '' ? "" : `<p style="color: #fff;"><b>Лапша: </b> ${elem.descriptionWok}`
            const isPizzazIng = elem.descriptionIngrideents === undefined ? "" : `<p style="color: #fff;"><b>Доп.Ингидеенты: </b> ${elem.descriptionIngrideents}`
            const isSizedPizza = elem.productSize === undefined ? "" : `<p style="color: #fff;"><b>Размер: </b> ${elem.productSize}</p>`
            
            return `
             <div style="display: flex; flex-direction: column; align-items: center;
                border: 1px solid lightgrey; margin-bottom: 10px; background-color: darkslategrey; border-radius: 8px; padding: 10px;">
                <p style="color: #fff;"><b>Toвар: </b> ${elem.product}</p>
                <p style="color: #fff;"><b>Состав: </b> ${elem.description}</p>
                <div style="color: #fff;">${isSizedPizza}</div>
                <div style="color: #fff;">${isPizzazIng}</div>
                <div style="color: #fff;">${isWokDescritp}</div>      
                <p style="color: #fff;"><b>Штук: </b> ${elem.count}</p>
                <p style="color: #fff;"><b>Цена: </b> ${elem.total}</p>
               </div>
            `});
            
        const deliveryInfoTime = () => {
            if(typeof deliveryTime === 'string') {
                return `
                <p><b style="font-size: 18px">Дата готовки: </b> ${deliveryTime}</p>
                `
            }
            const { dateDelivery, timeDelivery } = deliveryTime;
            return `
             <p><b style="font-size: 18px">Дата готовки/доставки: </b> ${dateDelivery}</p>
             <p><b style="font-size: 18px">К какому времени доставить/приготовить: </b> ${timeDelivery}</p>
            `
        };
        const deliveryInfo = () => {
            if(typeof delivery === 'string') {
            return `
                <p><b style="font-size: 18px">Способ получения заказа: </b> ${delivery}</p> 
              `
            }
            
        const {
          formDelivery,
          adress,
          street,
          home,
          apartment,
          podezd,
          etag,
          kodDveri
        } = delivery;

          return `
            <p><b style="font-size: 18px">Способ получения заказа: </b> ${formDelivery}</p>
            <p><b style="font-size: 18px">Населенный пункт: </b> ${adress}</p>
            <p><b style="font-size: 18px">Улица: </b> ${street}</p>
            <p><b style="font-size: 18px">Номер дома: </b> ${home}</p>
            <p><b style="font-size: 18px">Номер квартиры: </b> ${apartment}</p>
            <p><b style="font-size: 18px">Этаж: </b> ${etag}</p>
            <p><b style="font-size: 18px">Код двери: ${kodDveri} / Подьезд:${podezd}</b> </p>
        `
        };

    return {
        from: process.env.MAIL_FROM_EMAIL,
        to: process.env.MAIL_FROM_TO,
        subject: `НОВЫЙ ЗАКАЗ`,
        html: `
             <div>
                <p><b style="font-size: 18px">Имя:</b> ${name}</p>
                <p><b style="font-size: 18px">Телефон: </b> ${phone}</p>
                <a style="
                text-decoration: none; 
                font-weight: bold;
                font-size: 16px;
                color: white" href="tel:${phone}">
                <div style="background-color: tomato;
                width: 70%;
                border-radius: 10px;
                padding: 10px;
                ">Позвонить</div></a>
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;
                "><p style="font-size: 18px;"><b>Товары: </b></p>${orderList}</div>
                </div>
                <div>${deliveryInfo()}</div>
                <div>${deliveryInfoTime()}</div>
                <p><b style="font-size: 18px">Приборы(палочки): </b> ${chopsticks}</p>
                <p><b style="font-size: 18px">Сдача: </b> ${sdacha}</p>
                <p><b style="font-size: 18px">Общая цена к оплате: </b> ${totalPrice}</p>
                <p><b style="font-size: 18px">Комментарий к заказу: </b> ${comments}</p>
                <a style="
                text-decoration: none; 
                font-weight: bold;
                font-size: 16px;
                color: white" href="tel:${phone}">
                <div style="background-color: tomato;
                width: 70%;
                border-radius: 10px;
                padding: 10px;
                ">Позвонить</div></a>
                <span>подтвердить заказ</span>
            </div>
            <div  style="position: absolute;
            top: 0;
            right: 0;
            opacity: 0.03;">
                <img style="max-width: 100px;
                max-height: 100px;" src="https://svisni-sushi.ru/static/5e080b0ff3bde6f6e6524451d2385497/47525/logosvisni.png" alt="Свисни Суши" /> 
            </div> 
        `
    }
};