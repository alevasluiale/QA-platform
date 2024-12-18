const fetch = require("node-fetch"); // Add: npm install node-fetch

class AirtableService {
  constructor() {
    this.baseUrl = "https://api.airtable.com/v0";
    this.baseId = process.env.AIRTABLE_BASE_ID;
    this.token = process.env.AIRTABLE_TOKEN;
    this.tableId = process.env.AIRTABLE_TABLE_ID;
  }

  get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  async listRecords(params = {}) {
    console.log(params);
    try {
      const queryParams = new URLSearchParams();

      // Add pagination parameters
      if (params.offset) queryParams.append("offset", params.offset);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.maxRecords)
        queryParams.append("maxRecords", params.maxRecords);

      // Add filtering parameters
      if (params.filterByFormula) {
        queryParams.append("filterByFormula", params.filterByFormula);
      }

      // Add view parameter
      if (params.view) queryParams.append("view", params.view);

      const url = `${this.baseUrl}/${this.baseId}/${this.tableId}?${queryParams}`;

      console.log(url, this.headers);

      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to fetch records");
      }

      const data = await response.json();
      return {
        records: data.records.map((record) => ({
          id: record.id,
          ...record.fields,
        })),
        offset: data.offset,
      };
    } catch (error) {
      console.error("Error in listRecords:", error);
      throw error;
    }
  }

  async createRecord(fields) {
    try {
      const url = `${this.baseUrl}/${this.baseId}/${this.tableId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ fields }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to create record");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in createRecord:", error);
      throw error;
    }
  }

  async updateRecord(recordId, fields) {
    try {
      const url = `${this.baseUrl}/${this.baseId}/${this.tableId}/${recordId}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify({ fields }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to update record");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in updateRecord:", error);
      throw error;
    }
  }

  async deleteRecord(recordId) {
    try {
      const url = `${this.baseUrl}/${this.baseId}/${this.tableId}/${recordId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: this.headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to delete record");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in deleteRecord:", error);
      throw error;
    }
  }
}

module.exports = AirtableService;
