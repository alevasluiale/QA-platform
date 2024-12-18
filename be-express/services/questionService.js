const AirtableService = require("./airtableService");
const moment = require("moment");
const { parseProperties } = require("../utils/utils");

class QuestionsService extends AirtableService {
  constructor() {
    super();
  }

  async getQuestions(options = {}) {
    const { pageSize = 100, offset, assignedTo, properties, status } = options;

    let filterFormulas = [];

    // Build filter formulas
    if (assignedTo) {
      filterFormulas.push(`{Assigned To} = '${assignedTo}'`);
    }

    if (status) {
      filterFormulas.push(`{Status} = '${status}'`);
    }

    if (properties) {
      Object.entries(properties).forEach(([key, value]) => {
        filterFormulas.push(`FIND("${key}:${value}", {Properties}) > 0`);
      });
    }

    const params = {
      pageSize: Math.min(pageSize, 100),
      offset,
      view: "Grid view",
    };

    if (filterFormulas.length > 0) {
      params.filterByFormula =
        filterFormulas.length > 1
          ? `AND(${filterFormulas.join(",")})`
          : filterFormulas[0];
    }

    return await this.listRecords(params);
  }

  async createQuestion(data) {
    const {
      question,
      answer,
      questionDescription,
      createdBy,
      assignedTo,
      properties = {},
    } = data;

    if (!question) {
      throw new Error("Question is required");
    }

    const fields = {
      Question: question,
      Answer: answer || "",
      ["Question Description"]: questionDescription || "",
      ["Created By"]: createdBy,
      ["Updated By"]: createdBy,
      ["Assigned To"]: assignedTo || "",
      Properties: parseProperties(properties),
    };

    return await this.createRecord(fields);
  }

  async updateQuestion(id, data) {
    const {
      question,
      questionDescription,
      updatedBy,
      properties,
      assignedTo,
      answer,
    } = data;

    const fields = {
      ...(question && { Question: question }),
      ...(answer && { Answer: answer }),
      ...(assignedTo && { ["Assigned To"]: assignedTo }),
      ...(questionDescription && {
        ["Question Description"]: questionDescription,
      }),
      ["Updated By"]: updatedBy,
      ...(properties && { Properties: parseProperties(properties) }),
    };

    return await this.updateRecord(id, fields);
  }

  async assignQuestion(id, assignedTo, updatedBy) {
    return await this.updateRecord(id, {
      AssignedTo: assignedTo,
      UpdatedAt: moment().toISOString(),
      UpdatedBy: updatedBy,
    });
  }

  async bulkAssign(questionIds, assignedTo, updatedBy) {
    const updates = await Promise.allSettled(
      questionIds.map((id) => this.assignQuestion(id, assignedTo, updatedBy)),
    );

    return {
      successful: updates.filter((result) => result.status === "fulfilled")
        .length,
      failed: updates.filter((result) => result.status === "rejected").length,
      total: updates.length,
    };
  }
}

module.exports = new QuestionsService();
