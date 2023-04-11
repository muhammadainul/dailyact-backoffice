var   debug = require("debug");
const _     = require("lodash");
const Queue = require("better-queue");
const { post } = require("../libs/request")

let queueOption = {
    maxRetries : 3,
    retryDelay : 10 * 1000    // 10s
};

var log = debug("queues:elasticindex");

module.exports = () => {
    let queue = new Queue(async (payload, cb) => {
        log("[Queue] elasticindex:", payload);
        try {
            let   url      = services.elasticsearch + "index";
            let   body     = payload;
            const response = await post(url, {}, body);
            log("response.data", response.data);
            cb(null, { result: response.data });
        } catch (error) {
            log("error", { error });
            cb(error, null);
        }
    }, queueOption);

    queue.on("task_finish", async (taskId, result, stats) => {
        log("task_finish:elasticindex:", { taskId, result, stats });
    });

    queue.on("task_failed", async (taskId, error, stats) => {
        log("task_failed:", { taskId, error, stats });
    });

    queue.on("task_progress", (taskId, completed, total) => {
        log("task_progress:", { taskId, completed, total });
    });

    queue.on("empty", () => {
        log("all of the tasks have been pulled off of the queue.");
    });

    queue.on("drain", () => {
        log("there are no more tasks on the queue and when no more tasks are running.");
    });

    return queue
}