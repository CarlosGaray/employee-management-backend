import * as mongodb from 'mongodb';

export interface Employee {
    name: string,
    popsition: string,
    level: 'junior' | 'mid' | 'senior',
    _id?: mongodb.ObjectId
}