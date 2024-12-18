const base = require('../config/airtable');

const Tables = {
    Questions: base('Questions'),
    Answers: base('Answers'),
    Properties: base('Properties'),
    QuestionHistory: base('QuestionHistory'),

    fields: {
        Questions: [
            '_recordId',
            'CompanyName',
            '_companyId',
            'Question',
            'QuestionDescription',
            'CreatedAt',
            'CreatedBy',
            'UpdatedAt',
            'UpdatedBy',
            'AssignedTo',
            'Status'
        ],
        Answers: [
            '_recordId',
            'QuestionId',
            'Answer',
            'CreatedAt',
            'CreatedBy',
            'UpdatedAt',
            'UpdatedBy'
        ],
        Properties: [
            '_recordId',
            'QuestionId',
            'Key',
            'Value'
        ],
        QuestionHistory: [
            '_recordId',
            'QuestionId',
            'ChangeType',
            'PreviousValue',
            'NewValue',
            'ChangedBy',
            'ChangedAt',
            'Comment'
        ]
    }
};

module.exports = Tables;
