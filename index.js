const { sequelize, Phone } = require('./models');
const { Op, Sequelize } = require('sequelize');

(async function () {
  const phone = {
    model: 'IPhone 15',
    brand: 'Apple',
    year: 2023,
    cpu: 'A15 Bionic',
    ram: 8,
    screenSize: 6.1,
  };
  // додавання нового телефону,
  const createdPhone = await Phone.create(phone);
  console.log('createdPhone:', createdPhone.get());

  // отримання списку телефонів (* 3-я сторінка при перегляді по 4 телефони на сторінці, упорядкованих за роком виробництва)
  const page = 3;
  const limit = 4;
  const offset = page - 1 + limit;
  const foundPhones1 = await Phone.findAll({
    raw: true,
    order: [['year']],
    limit,
    offset,
  });
  console.log('foundPhones1:', foundPhones1);

  // *отримання списку телефонів поточного року видання
  const currentYear = new Date().getFullYear();
  const foundPhones2 = await Phone.findAll({
    raw: true,
    where: {
      year: currentYear,
    },
  });
  console.log('foundPhones2:', foundPhones2);

  // *отримання списку телефонів старше 2022 року випуску,
  const foundPhones3 = await Phone.findAll({
    raw: true,
    where: {
      year: { [Op.gt]: 2022 },
    },
  });
  console.log('foundPhones3:', foundPhones3);

  // оновлення: змінити розмір оперативної пам'яті телефону з id: 1.
  const updatedPhones1 = await Phone.update(
    { ram: 6 },
    {
      raw: true,
      where: { id: 1 },
      returning: true,
    }
  );
  console.log('updatedPhone1:', updatedPhones1[1][0]);

  // *оновлення: додати нфс всім телефонам 2023 року випуску,
  const updatedPhones3 = await Phone.update(
    { nfc: true },
    {
      raw: true,
      where: {
        year: 2023,
      },
      returning: true,
    }
  );
  console.log('updatedPhones3', updatedPhones3[1]);

  // видалення телефону з id: 2.
  const deletedPhonesCount = await Phone.destroy({
    where: {
      id: 2,
    },
  });
  console.log('deletedPhonesCount:', deletedPhonesCount);

  const deletedPhonesCount2 = await Phone.destroy({
    where: {
      year: 2015,
    },
  });
  console.log('deletedPhonesCount2', deletedPhonesCount2);

  // **вивести середній розмір оперативної пам'яті телефонів
  const foundPhones4 = await Phone.findAll({
    raw: true,
    attributes: [[sequelize.fn('AVG', sequelize.col('ram')), 'averageRam']],
  });
  console.log('foundPhones3', foundPhones4);

  // **вивести кількість телефонів кожної марки.
  const foundPhones5 = await Phone.findAll({
    raw: true,
    attributes: [
      'brand',
      [sequelize.fn('COUNT', sequelize.col('brand')), 'phoneCount'],
    ],
    group: 'brand',
  });
  console.log('foundPhones4', foundPhones5);

  // **вивести бренди, у телефонів яких максимальна діагональ більше за 6.6
  const foundPhones6 = await Phone.findAll({
    raw: true,
    attributes: [
      'brand',
      [sequelize.fn('MAX', sequelize.col('screenSize')), 'maxScreenSize'],
    ],
    group: ['brand'],
    having: sequelize.literal('MAX("screenSize") >= 6.6'),
  });
  console.log('foundPhones5', foundPhones6);
})();
