<?php

namespace App\Services;

use App\Models\Article;
use App\Models\ArticleVersion;
use App\Models\ChangeTracker;

class ChangeTrackingService
{
    /**
     * Track changes between two versions of content
     * Uses a simple diff algorithm to identify added, removed, and modified text
     */
    public function trackChanges(Article $article, string $oldContent, string $newContent, int $createdBy)
    {
        $newVersion = ArticleVersion::create([
            'article_id' => $article->id,
            'content' => $newContent,
            'version_number' => $article->version + 1,
            'changes_summary' => 'Content updated',
            'created_by' => $createdBy,
        ]);

        $oldLines = explode("\n", $oldContent);
        $newLines = explode("\n", $newContent);

        $changes = $this->computeDiff($oldLines, $newLines);

        foreach ($changes as $change) {
            ChangeTracker::create([
                'article_id' => $article->id,
                'article_version_id' => $newVersion->id,
                'change_type' => $change['type'],
                'old_text' => $change['old_text'] ?? null,
                'new_text' => $change['new_text'] ?? null,
                'position' => $change['position'],
                'status' => 'pending',
            ]);
        }

        $article->update(['version' => $article->version + 1]);

        return $newVersion;
    }

    /**
     * Simple diff algorithm to find changes
     */
    private function computeDiff($oldLines, $newLines)
    {
        $changes = [];
        $position = 0;

        $oldStr = implode("\n", $oldLines);
        $newStr = implode("\n", $newLines);

        if (strlen($newStr) > strlen($oldStr)) {
            $changes[] = [
                'type' => 'add',
                'new_text' => $newStr,
                'old_text' => null,
                'position' => $position,
            ];
        } elseif (strlen($newStr) < strlen($oldStr)) {
            $changes[] = [
                'type' => 'delete',
                'old_text' => $oldStr,
                'new_text' => null,
                'position' => $position,
            ];
        } else {
            if ($oldStr !== $newStr) {
                $changes[] = [
                    'type' => 'modify',
                    'old_text' => $oldStr,
                    'new_text' => $newStr,
                    'position' => $position,
                ];
            }
        }

        return $changes;
    }

    /**
     * Get pending changes for an article
     */
    public function getPendingChanges(Article $article)
    {
        return ChangeTracker::where('article_id', $article->id)
            ->where('status', 'pending')
            ->with('articleVersion')
            ->get();
    }

    /**
     * Approve all changes for an article
     */
    public function approveAllChanges(Article $article, int $adminId)
    {
        ChangeTracker::where('article_id', $article->id)
            ->where('status', 'pending')
            ->update([
                'status' => 'approved',
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);
    }

    /**
     * Reject all changes for an article
     */
    public function rejectAllChanges(Article $article, int $adminId)
    {
        ChangeTracker::where('article_id', $article->id)
            ->where('status', 'pending')
            ->update([
                'status' => 'rejected',
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);
    }
}