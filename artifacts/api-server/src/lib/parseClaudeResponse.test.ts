import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseAnalysisResponse,
  parseFormAssistance,
  parseProcessGuidance,
} from "./parseClaudeResponse.js";

describe("parseAnalysisResponse", () => {
  it("parses an explanation response with points, dates, and steps", () => {
    const result = parseAnalysisResponse(
      "<summary>Plain summary</summary><point>First point</point><point>Second point</point><date><label>Expiry</label><value>2099-01-01</value></date><step>Visit the Lands Commission</step><document_type>lease</document_type>",
      "explain",
    );

    assert.equal(result.summary, "Plain summary");
    assert.deepEqual(result.keyPoints, ["First point", "Second point"]);
    assert.equal(result.importantDates[0]?.label, "Expiry");
    assert.equal(result.importantDates[0]?.value, "2099-01-01");
    assert.equal(result.nextSteps[0], "Visit the Lands Commission");
    assert.equal(result.documentType, "lease");
  });

  it("uses safe defaults when the response is empty or the date is invalid", () => {
    const emptyResult = parseAnalysisResponse("", "explain");
    const invalidDateResult = parseAnalysisResponse(
      "<date><label>Deadline</label><value>not-a-date</value></date>",
      "explain",
    );

    assert.equal(emptyResult.summary, "");
    assert.deepEqual(emptyResult.keyPoints, []);
    assert.equal(emptyResult.overallRiskLevel, "LOW");
    assert.equal(invalidDateResult.importantDates[0]?.daysUntil, undefined);
  });

  it("parses red flags and defaults unknown risk values conservatively", () => {
    const result = parseAnalysisResponse(
      "<overall_risk>HIGH</overall_risk><document_summary>Review needed</document_summary><flag><severity>HIGH</severity><issue>Missing signature</issue><explanation>No vendor signature</explanation><recommendation>Verify before signing</recommendation></flag><flag><severity>UNKNOWN</severity><issue>Unclear stamp</issue></flag>",
      "redFlags",
    );

    assert.equal(result.overallRiskLevel, "HIGH");
    assert.equal(result.summary, "Review needed");
    assert.equal(result.redFlags[0]?.severity, "HIGH");
    assert.equal(result.redFlags[1]?.severity, "MEDIUM");
  });

  it("defaults an unknown overall risk to LOW", () => {
    assert.equal(
      parseAnalysisResponse("<overall_risk>UNSURE</overall_risk>", "redFlags")
        .overallRiskLevel,
      "LOW",
    );
  });
});

describe("parseProcessGuidance", () => {
  it("parses process metadata and only keeps steps with descriptions", () => {
    const result = parseProcessGuidance(
      "<process_name>Title Search</process_name><estimated_fees>GHS 50</estimated_fees><estimated_duration>One week</estimated_duration><doc>Indenture</doc><office>Accra office</office><step><number>1</number><title>Submit</title><description>Submit the request</description><office>Front desk</office><fee>GHS 50</fee><documents>Indenture, ID</documents></step><step><number>2</number><description></description></step>",
    );

    assert.equal(result.processName, "Title Search");
    assert.equal(result.estimatedFees, "GHS 50");
    assert.deepEqual(result.requiredDocuments, ["Indenture"]);
    assert.deepEqual(result.offices, ["Accra office", "Front desk"]);
    assert.equal(result.steps.length, 1);
    assert.deepEqual(result.steps[0]?.documents, ["Indenture", "ID"]);
  });
});

describe("parseFormAssistance", () => {
  it("parses field guidance and optional instructions", () => {
    const result = parseFormAssistance(
      "<form_name>Application</form_name><form_summary>Registration form</form_summary><submission_instructions>Submit in person</submission_instructions><mistake>Leave no required field blank</mistake><field><name>Applicant name</name><instructions>Enter your legal name</instructions><example>Akua Doe</example><required>true</required><common_mistake>Using a nickname</common_mistake></field><field><name></name></field>",
    );

    assert.equal(result.formName, "Application");
    assert.equal(result.fieldGuidance.length, 1);
    assert.equal(result.fieldGuidance[0]?.required, true);
    assert.equal(result.fieldGuidance[0]?.example, "Akua Doe");
    assert.deepEqual(result.commonMistakes, ["Leave no required field blank"]);
  });
});
