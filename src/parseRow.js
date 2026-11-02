"use strict";

function parseNonNegativeInteger(value) {
  const length = value.length;
  if (length === 0) {
    return null;
  }

  let parsed = 0;
  for (let i = 0; i < length; i += 1) {
    const digit = value.charCodeAt(i) - 48;
    if (digit < 0 || digit > 9) {
      return null;
    }
    parsed = parsed * 10 + digit;
  }

  return Number.isSafeInteger(parsed) ? parsed : null;
}

function parseNonNegativeNumber(value) {
  if (value.length === 0) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function isIsoDate(value) {
  return (
    value.length === 10 &&
    value.charCodeAt(4) === 45 &&
    value.charCodeAt(7) === 45 &&
    isDigitRun(value, 0, 4) &&
    isDigitRun(value, 5, 7) &&
    isDigitRun(value, 8, 10)
  );
}

function isDigitRun(value, start, end) {
  for (let i = start; i < end; i += 1) {
    const digit = value.charCodeAt(i) - 48;
    if (digit < 0 || digit > 9) {
      return false;
    }
  }
  return true;
}

function nextField(line, start) {
  const comma = line.indexOf(",", start);
  if (comma === -1) {
    return { value: line.slice(start), next: -1 };
  }
  return { value: line.slice(start, comma), next: comma + 1 };
}

function parseRow(line) {
  if (typeof line !== "string" || line.length === 0) {
    return null;
  }

  const campaign = nextField(line, 0);
  if (campaign.next === -1 || campaign.value.length === 0) {
    return null;
  }

  const date = nextField(line, campaign.next);
  if (date.next === -1 || !isIsoDate(date.value)) {
    return null;
  }

  const impressionsField = nextField(line, date.next);
  if (impressionsField.next === -1) {
    return null;
  }

  const clicksField = nextField(line, impressionsField.next);
  if (clicksField.next === -1) {
    return null;
  }

  const spendField = nextField(line, clicksField.next);
  if (spendField.next === -1) {
    return null;
  }

  const conversionsField = nextField(line, spendField.next);
  if (conversionsField.next !== -1) {
    return null;
  }

  const impressions = parseNonNegativeInteger(impressionsField.value);
  const clicks = parseNonNegativeInteger(clicksField.value);
  const spend = parseNonNegativeNumber(spendField.value);
  const conversions = parseNonNegativeInteger(conversionsField.value);

  if (
    impressions == null ||
    clicks == null ||
    spend == null ||
    conversions == null
  ) {
    return null;
  }

  return {
    campaignId: campaign.value,
    impressions,
    clicks,
    spend,
    conversions,
  };
}

module.exports = { parseRow };
