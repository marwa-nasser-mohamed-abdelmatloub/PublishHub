<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Article;
use App\Models\ArticleVersion;
use App\Models\ReviewAssignment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Create Authors
        $author1 = User::create([
            'name' => 'John Author',
            'email' => 'author1@example.com',
            'password' => Hash::make('password123'),
            'role' => 'author',
        ]);

        $author2 = User::create([
            'name' => 'Jane Author',
            'email' => 'author2@example.com',
            'password' => Hash::make('password123'),
            'role' => 'author',
        ]);

        // Create Reviewers
        $reviewer1 = User::create([
            'name' => 'Mike Reviewer',
            'email' => 'reviewer1@example.com',
            'password' => Hash::make('password123'),
            'role' => 'reviewer',
        ]);

        $reviewer2 = User::create([
            'name' => 'Sarah Reviewer',
            'email' => 'reviewer2@example.com',
            'password' => Hash::make('password123'),
            'role' => 'reviewer',
        ]);

        // Create sample articles
        $article1 = Article::create([
            'title' => 'Introduction to Laravel',
            'content' => 'Laravel is a web application framework with expressive, elegant syntax. It attempts to take the pain out of development by easing common tasks used in the majority of web projects.',
            'status' => 'draft',
            'author_id' => $author1->id,
            'version' => 1,
        ]);

        ArticleVersion::create([
            'article_id' => $article1->id,
            'content' => 'Laravel is a web application framework with expressive, elegant syntax. It attempts to take the pain out of development by easing common tasks used in the majority of web projects.',
            'version_number' => 1,
            'changes_summary' => 'Initial version',
            'created_by' => $author1->id,
        ]);

        $article2 = Article::create([
            'title' => 'Building REST APIs',
            'content' => 'REST API stands for Representational State Transfer API. It is a style of software architecture for web development that emphasizes component interactions, scalability, and a uniform interface.',
            'status' => 'submitted',
            'author_id' => $author2->id,
            'version' => 1,
        ]);

        ArticleVersion::create([
            'article_id' => $article2->id,
            'content' => 'REST API stands for Representational State Transfer API. It is a style of software architecture for web development that emphasizes component interactions, scalability, and a uniform interface.',
            'version_number' => 1,
            'changes_summary' => 'Initial version',
            'created_by' => $author2->id,
        ]);

        // Assign reviewers
        ReviewAssignment::create([
            'article_id' => $article2->id,
            'reviewer_id' => $reviewer1->id,
            'assigned_by' => $admin->id,
            'status' => 'assigned',
        ]);

        ReviewAssignment::create([
            'article_id' => $article2->id,
            'reviewer_id' => $reviewer2->id,
            'assigned_by' => $admin->id,
            'status' => 'assigned',
        ]);
    }
}
