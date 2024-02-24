import { NextFunction, Response, Request } from "express";
import Season from "../models/Season";
import { StatusEnum } from "../models/Season";
import getContentLocation from "../shared/get-content-location";
import Message from "../shared/Message";

const message = new Message("harvest season");

function create(req: Request, res: Response, next: NextFunction) {
  const season = new Season({
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    payrollTimeframe: req.body.payrollTimeframe,
    price: req.body.price,
    // TODO: Add productID, unitID, currencyID
  });

  season
    .save()
    .then((data) => {
      const url = getContentLocation(req, data._id);

      res
        .set("content-location", url)
        .status(201)
        .json({
          data,
          error: false,
          message: message.create("success"),
        });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.create("error"),
      });
    });
}

function getAll(req: Request, res: Response, next: NextFunction) {
  Season.find({ deletedAt: null })
    .select("name status startDate endDate")
    .exec()
    .then((data) => {
      res.status(200).json({
        data,
        error: false,
        message: message.get("success"),
      });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.get("error"),
      });
    });
}

function getById(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findById(id)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ data, error: true, message: message.get("not_found") });
      }

      res
        .status(200)
        .json({ data, error: false, message: message.get("success") });
    })
    .catch(() => {
      res
        .status(500)
        .json({ data: null, error: true, message: message.get("error") });
    });
}

function close(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { status: StatusEnum.CLOSED, endDate: new Date().getTime() },
    { new: true }
  )
    .exec()
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ data, error: true, message: message.get("not_found") });
      }

      res.status(200).json({
        data,
        error: false,
        message: message.update("success", "closed"),
      });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.update("error"),
      });
    });
}

function update(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findOneAndUpdate({ _id: id }, req.body, { new: true })
    .exec()
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ data, error: true, message: message.get("not_found") });
      }

      res.status(200).json({
        data,
        error: false,
        message: message.update("success"),
      });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.update("error"),
      });
    });
}

function remove(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findOneAndUpdate(
    { _id: id, hasHarvestLog: false, deletedAt: null },
    { deletedAt: new Date().getTime() },
    { returnDocument: "after" }
  )
    .exec()
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ data, error: true, message: message.get("not_found") });
      }

      res.status(200).json({
        data,
        error: false,
        message: message.delete("success"),
      });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.delete("error"),
      });
    });
}

const seasonController = {
  create,
  getAll,
  getById,
  close,
  update,
  remove,
};

export default seasonController;
