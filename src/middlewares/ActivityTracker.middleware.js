import ActivityLogModel from "../models/activityLog/ActivityLog.model.js";
import { getClientIp } from "../utils/clientIp.js";
import { buildActivityLogDetails } from "../utils/activityLogDetails.js";

const activityTracker = (req, res, next) => {
  // We only track write ops
  const writeMethods = ["POST", "PUT", "DELETE", "PATCH"];
  if (!writeMethods.includes(req.method)) {
    return next();
  }

  // Hook into res.on('finish')
  res.on("finish", async () => {
    try {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Must be authenticated and have admin/editor role
        const user = req.user;
        if (!user || !user.roles) return;

        let rolesObj = user.roles;
        let isAdmin = false;
        let isEditor = false;

        if (typeof rolesObj === "string") {
          // Handle cases where role is saved as a direct string like 'admin'
          if (rolesObj === "admin" || rolesObj === '"admin"') isAdmin = true;
          if (rolesObj === "editor" || rolesObj === '"editor"') isEditor = true;

          try {
            const parsed = JSON.parse(rolesObj);
            if (typeof parsed === "object" && parsed !== null) {
              isAdmin = parsed.admin === true || parsed.admin === "true";
              isEditor = parsed.editor === true || parsed.editor === "true";
            }
          } catch (e) {
            // Already handled direct string assignment above
          }
        } else if (typeof rolesObj === "object" && rolesObj !== null) {
          isAdmin = rolesObj.admin === true || rolesObj.admin === "true";
          isEditor = rolesObj.editor === true || rolesObj.editor === "true";
        }

        if (isAdmin || isEditor) {
          const methodMap = {
            POST: "Create",
            PUT: "Update",
            PATCH: "Update",
            DELETE: "Delete",
          };

          const action = methodMap[req.method] || req.method;

          const path = req.originalUrl.split("?")[0];
          const pathParts = path.split("/").filter((p) => p !== "");

          let resource = "unknown";
          if (pathParts[0] === "api" && pathParts[1] === "v1" && pathParts[2]) {
            resource = pathParts[2];
          } else if (pathParts.length > 0) {
            resource = pathParts[pathParts.length - 1]; // fallback
          }

          const details = buildActivityLogDetails(req, resource, action);

          const ip_address = getClientIp(req);

          await ActivityLogModel.create({
            user_id: user.id,
            action,
            resource,
            endpoint: req.originalUrl,
            ip_address,
            details,
          });
        }
      }
    } catch (error) {
      console.error("ActivityTracker Error:", error);
    }
  });

  next();
};

export default activityTracker;
