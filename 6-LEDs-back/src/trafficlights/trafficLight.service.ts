import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Traffic, TrafficSchema } from './trafficLight.model';

@Injectable()
export class TrafficService {
  private readonly trafficModel: Model<Traffic>;

  constructor(@InjectModel('Traffic') private readonly injectedTrafficModel: Model<Traffic>) {
    this.trafficModel = injectedTrafficModel;
  }

  async insertTraffic(id: string, long: number, lat: number, color: string) {
    const createdTraffic = new this.trafficModel({ id, long, lat, color });
    const result = await createdTraffic.save();
    return result.id as string;
  }

  async getTraffic() {
    try {
      const trafficData = await this.trafficModel.find().exec();
      return trafficData.map((traffic: Traffic) => ({
        id: traffic.id,
        long: traffic.long,
        lat: traffic.lat,
        color: traffic.color,
      }));
    } catch (error) {
      throw new NotFoundException('Could not fetch traffic data.');
    }
  }

  async getSingleTraffic(trafficId: string) {
    try {
      const traffic = await this.trafficModel.findOne({ id: trafficId }).exec();

      if (!traffic) {
        throw new NotFoundException('Could not find traffic data.');
      }

      return {
        id: traffic.id,
        long: traffic.long,
        lat: traffic.lat,
        color: traffic.color,
      };
    } catch (error) {
      throw new NotFoundException('Could not find traffic data.');
    }
  }

  async getSingleColor(trafficId: string) {
    try {
      const traffic = await this.trafficModel.findOne({ id: trafficId }).exec();

      if (!traffic) {
        throw new NotFoundException('Could not find traffic data.');
      }

      return {
        color: traffic.color,
      };
    } catch (error) {
      throw new NotFoundException('Could not find traffic data.');
    }
  }

  async getSingleLongLat(trafficId: string) {
    try {
      const traffic = await this.trafficModel.findOne({ id: trafficId }).exec();

      if (!traffic) {
        throw new NotFoundException('Could not find traffic data.');
      }

      return {
        long: traffic.long,
        lat: traffic.lat,
      };
    } catch (error) {
      throw new NotFoundException('Could not find traffic data.');
    }
  }

  async updateTrafficLongLat(trafficId: string, long: number, lat: number) {
    try {
      const result = await this.trafficModel.updateOne(
        { id: trafficId },
        { $set: { long, lat } },
      ).exec();

      if (result.modifiedCount === 0) {
        throw new NotFoundException('Could not find traffic data.');
      }
    } catch (error) {
      throw new NotFoundException('Could not update traffic data.');
    }
  }

  async updateTrafficColor(trafficId: string, color: string) {
    try {
      const result = await this.trafficModel.updateOne(
        { id: trafficId },
        { $set: { color } },
      ).exec();

      if (result.modifiedCount === 0) {
        throw new NotFoundException(`Could not find traffic data with id ${trafficId}`);
      }

      console.log(`${trafficId} changed to ${color}`);
    } catch (error) {
      throw new NotFoundException('Could not update traffic data.');
    }
  }

  async deleteTraffic(trafficId: string) {
    try {
      const result = await this.trafficModel.deleteOne({ id: trafficId }).exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException('Could not find traffic data.');
      }
    } catch (error) {
      throw new NotFoundException('Could not delete traffic data.');
    }
  }
}


/*import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoClient } from 'mongodb';

import { Traffic } from './trafficLight.model';

@Injectable()
export class TrafficService {
  async insertTraffic(id: string, long: number, lat: number, color: string) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/trafficLights');

    try {
      await client.connect();
      const db = client.db('trafficLights');
      const collection = db.collection('trafficData');

      const result = await collection.insertOne({
        id,
        long,
        lat,
        color,
      });

      return result.insertedId.toString();
    } finally {
      await client.close();
    }
  }

  async getTraffic() {
    const client = new MongoClient('mongodb://127.0.0.1:27017/trafficLights');

    try {
      await client.connect();
      const db = client.db('trafficLights');
      const collection = db.collection('trafficData');

      const trafficData = await collection.find().toArray();

      return trafficData.map((traffic: any) => ({
        id: traffic.id,
        long: traffic.long,
        lat: traffic.lat,
        color: traffic.color,
      }));
    } finally {
      await client.close();
    }
  }

  async getSingleTraffic(trafficId: string) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/trafficLights');

    try {
      await client.connect();
      const db = client.db('trafficLights');
      const collection = db.collection('trafficData');

      const traffic = await collection.findOne({ id: trafficId });

      if (!traffic) {
        throw new NotFoundException('Could not find traffic data.');
      }

      return {
        id: traffic.id,
        long: traffic.long,
        lat: traffic.lat,
        color: traffic.color,
      };
    } finally {
      await client.close();
    }
  }

  async getSingleColor(trafficId: string) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/trafficLights');

    try {
      await client.connect();
      const db = client.db('trafficLights');
      const collection = db.collection('trafficData');

      const traffic = await collection.findOne({ id: trafficId });

      if (!traffic) {
        throw new NotFoundException('Could not find traffic data.');
      }

      console.log(traffic.color);

      return {
        color: traffic.color,
      };
    } finally {
      await client.close();
    }
  }

  async updateTraffic(
    trafficId: string,
    long: number,
    lat: number,
    color: string,
  ) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/trafficLights');

    try {
      await client.connect();
      const db = client.db('trafficLights');
      const collection = db.collection('trafficData');

      const filter = { id: trafficId };
      const update = {
        $set: {
          long: long,
          lat: lat,
          color: color,
        },
      };

      const result = await collection.updateOne(filter, update);

      if (result.modifiedCount === 0) {
        throw new NotFoundException('Could not find traffic data.');
      }
    } finally {
      await client.close();
    }
  }

  async deleteTraffic(trafficId: string) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/trafficLights');

    try {
      await client.connect();
      const db = client.db('trafficLights');
      const collection = db.collection('trafficData');

      const result = await collection.deleteOne({ id: trafficId });

      if (result.deletedCount === 0) {
        throw new NotFoundException('Could not find traffic data.');
      }
    } finally {
      await client.close();
    }
  }

  private async findTraffic(id: string): Promise<Traffic> {
    const client = new MongoClient('mongodb://127.0.0.1:27017/trafficLights');

    try {
      await client.connect();
      const db = client.db('trafficLights');
      const collection = db.collection('trafficData');

      const traffic = await collection.findOne({ id: id });

      if (!traffic) {
        throw new NotFoundException('Could not find traffic data.');
      }

      return traffic as Traffic;
    } finally {
      await client.close();
    }
  }

  async updateTrafficColor(id: string, color: string) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/trafficLights');

    try {
      await client.connect();
      const db = client.db('trafficLights');
      const collection = db.collection('trafficData');

      const filter = { id: id };
      const update = {
        $set: {
          color: color,
        },
      };

      const result = await collection.updateOne(filter, update);

      if (result.modifiedCount === 0) {
        throw new NotFoundException(`Could not find traffic data with id ${id}`);
      }

      console.log(`${id} changed to ${color}`);
    } finally {
      await client.close();
    }
  }
}*/
