import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifyDocument } from "../../../../lib/api-zod/src/document.js";

describe("classifyDocument", () => {
  it("Given two GLC keywords, when classification runs, then it returns the document type", () => {
    assert.equal(
      classifyDocument("This Indenture is made between the vendor and purchaser."),
      "indenture",
    );
    assert.equal(
      classifyDocument("Certificate of Title, Land Title Registry"),
      "titleDeed",
    );
    assert.equal(classifyDocument("Lease agreement between lessor and lessee"), "lease");
    assert.equal(
      classifyDocument("Ghana Lands Commission Form No 2"),
      "glcForm",
    );
  });

  it("Given fewer than two keywords, when classification runs, then it returns unknown", () => {
    assert.equal(classifyDocument("Indenture"), "unknown");
    assert.equal(classifyDocument("A general land document"), "unknown");
  });

  it("matches keywords without regard to case", () => {
    assert.equal(
      classifyDocument("GHANA LANDS COMMISSION - APPLICATION FOR REGISTRATION"),
      "glcForm",
    );
  });
});
