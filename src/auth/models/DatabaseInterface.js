'use strict';

class DatabaseInterface {
  constructor(model) {
    this.model = model;
  }

  async read(username) {
    try {
      return username ? this.model.findOne( { where: { username: username } }) : this.model.findAll();
    } catch(err) { console.log(err); }
  }

  async create(obj) {
    if(!obj) throw new Error('Update object not found');
    try {
      return this.model.create(obj);
    } catch(err) { console.log(err); }
  }

  async update(obj, id) {
    if(!id || !obj) throw new Error('Update requires valid JSON and ID');
    try {
      await this.model.update(obj, { where: { id: id } });
      return this.model.findOne({where: { id: id } });
    } catch(err) {console.log(err);}
  }

  async delete(id) {
    if(!id) throw new Error('Delete requires ID');
    try {
      let record = await this.model.findOne( {Where: { id: id } });
      await this.model.destroy({ where: { id: id} });
      return record;
    } catch(err) {console.log(err);}
  }
}

module.exports = DatabaseInterface;