import { NextFunction, Response, Request } from "express";
import Deduction from "../models/Deduction";
import getContentLocation from "../shared/get-content-location";

function create(req: Request, res: Response, next: NextFunction) {
  const deduction = new Deduction({
    name: req.body.name,
  });

  deduction
    .save()
    .then((results) => {
      const url = getContentLocation(req, results._id);

      res.set("content-location", url).status(201).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

function getAll(req: Request, res: Response, next: NextFunction) {
  Deduction.find({ deletedAt: null })
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

function getById(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Deduction.findOne({ _id: id, deletedAt: null })
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

function remove(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Deduction.findOneAndUpdate(
    { _id: id },
    {
      deletedAt: new Date().getTime(),
      deletedBy: "",
    },
    {
      returnDocument: "after",
    }
  )
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

const deductionController = {
  create,
  getAll,
  getById,
  remove,
};

export default deductionController;
