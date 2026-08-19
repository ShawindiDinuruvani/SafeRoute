package com.saferoute.dto;

import jakarta.validation.constraints.NotBlank;

public class ActionRequest {
    @NotBlank
    private String actionTaken;

    private String actionStatus; // e.g. "In Progress", "Resolved", "Under Investigation"

    public ActionRequest() {}

    public String getActionTaken() { return actionTaken; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }
    public String getActionStatus() { return actionStatus; }
    public void setActionStatus(String actionStatus) { this.actionStatus = actionStatus; }
}
