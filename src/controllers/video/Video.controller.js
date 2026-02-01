import VideoService from "../../services/video/Video.service.js";

const videoService = new VideoService();

class VideoController {
    static async listVideos(req, res) {
        try {
            const { items, pagination } = await videoService.listVideos(req.query);
            return res.status(200).json({
                message: "Videos retrieved",
                items,
                pagination,
            });
        } catch (error) {
            console.error("Error getting Videos:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }

    static async getVideoById(req, res) {
        try {
            const video = await videoService.getVideoById(req.params.id);
            return res.status(200).json(video);
        } catch (error) {
            console.error("Error getting Video by ID:", error);
            return res.status(500).json({ error: "Failed to get video" });
        }
    }

    static async getVideoBySlug(req, res) {
        try {
            const video = await videoService.getVideoBySlug(req.params.slug);
            return res.status(200).json(video);
        } catch (error) {
            console.error("Error getting Video by Slug:", error);
            return res.status(500).json({ error: "Failed to get video" });
        }
    }

    static async createVideo(req, res) {
        try {
            const result = await videoService.createVideo(req.body);
            return res
                .status(201)
                .json({ message: "Video created successfully", video: result });
        } catch (error) {
            console.error("Error in createVideo:", error);
            return res.status(500).json({ error: "Failed to create video" });
        }
    }

    static async updateVideo(req, res) {
        try {
            const result = await videoService.updateVideo(req.params.id, req.body);
            return res
                .status(200)
                .json({ message: "Video updated successfully", video: result });
        } catch (error) {
            console.error("Error in updateVideo:", error);
            return res.status(500).json({ error: "Failed to update video" });
        }
    }

    static async deleteVideo(req, res) {
        try {
            await videoService.deleteVideo(req.query.id);
            return res.status(200).json({ message: "Video deleted" });
        } catch (error) {
            console.error("Error deleting Video:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }
}

export default VideoController;
