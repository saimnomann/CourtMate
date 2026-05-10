const db = require("../config/db");

const Equipment = {

  async createEquipment(
    equipmentName,
    category,
    totalQuantity,
    rentalPrice
  ) {

    const sql = `
      INSERT INTO equipment
      (
        equipment_name,
        category,
        total_quantity,
        available_quantity,
        rental_price
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      equipmentName,
      category,
      totalQuantity,
      totalQuantity,
      rentalPrice
    ]);

    return result;
  },

  async getAllEquipment() {

    const sql = `
      SELECT *
      FROM equipment
      ORDER BY created_at DESC
    `;

    const [rows] = await db.execute(sql);

    return rows;
  },

  async getEquipmentById(id) {

    const sql = `
      SELECT *
      FROM equipment
      WHERE id = ?
    `;

    const [rows] = await db.execute(sql, [id]);

    return rows[0];
  },

  async deleteEquipment(id) {

    const sql = `
      DELETE FROM equipment
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [id]);

    return result;
  },

  async rentEquipment(
    athleteId,
    equipmentId,
    quantity,
    rentalDate,
    totalAmount
  ) {

    const sql = `
      INSERT INTO equipment_rentals
      (
        athlete_id,
        equipment_id,
        quantity,
        rental_date,
        total_amount
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      athleteId,
      equipmentId,
      quantity,
      rentalDate,
      totalAmount
    ]);

    return result;
  },

  async decreaseAvailableQuantity(id, quantity) {

    const sql = `
      UPDATE equipment
      SET available_quantity = available_quantity - ?
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [quantity, id]);

    return result;
  },

  async increaseAvailableQuantity(id, quantity) {

    const sql = `
      UPDATE equipment
      SET available_quantity = available_quantity + ?
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [quantity, id]);

    return result;
  },

  async getMyRentals(athleteId) {

    const sql = `
      SELECT
        equipment_rentals.*,
        equipment.equipment_name,
        equipment.category
      FROM equipment_rentals
      JOIN equipment
        ON equipment_rentals.equipment_id = equipment.id
      WHERE equipment_rentals.athlete_id = ?
      ORDER BY equipment_rentals.created_at DESC
    `;

    const [rows] = await db.execute(sql, [athleteId]);

    return rows;
  },

  async getRentalById(id) {

    const sql = `
      SELECT *
      FROM equipment_rentals
      WHERE id = ?
    `;

    const [rows] = await db.execute(sql, [id]);

    return rows[0];
  },

  async returnEquipment(rentalId) {

    const sql = `
      UPDATE equipment_rentals
      SET
        status = 'Returned',
        return_date = CURDATE()
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [rentalId]);

    return result;
  },
  async getAllRentals() {
  const sql = `
    SELECT
      equipment_rentals.*,
      users.full_name,
      users.email,
      equipment.equipment_name,
      equipment.category
    FROM equipment_rentals
    JOIN users ON equipment_rentals.athlete_id = users.id
    JOIN equipment ON equipment_rentals.equipment_id = equipment.id
    ORDER BY equipment_rentals.created_at DESC
  `;

  const [rows] = await db.execute(sql);
  return rows;
},
};

module.exports = Equipment;