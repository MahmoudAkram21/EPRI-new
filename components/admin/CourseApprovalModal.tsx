'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CourseApprovalModalProps {
    courseId: string;
    isOpen: boolean;
    onClose: () => void;
    onApprove: (courseId: string) => void;
    onReject: (courseId: string, reason: string) => void;
}

export function CourseApprovalModal({
    courseId,
    isOpen,
    onClose,
    onApprove,
    onReject
}: CourseApprovalModalProps) {
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);

    const handleApprove = () => {
        onApprove(courseId);
        handleClose();
    };

    const handleReject = () => {
        if (rejectionReason.trim()) {
            onReject(courseId, rejectionReason);
            handleClose();
        }
    };

    const handleClose = () => {
        setRejectionReason('');
        setShowRejectForm(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Course Approval</DialogTitle>
                    <DialogDescription>
                        {showRejectForm
                            ? 'Please provide a reason for rejecting this course'
                            : 'Choose an action for this course'}
                    </DialogDescription>
                </DialogHeader>

                {!showRejectForm ? (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Do you want to approve or reject this course?
                        </p>
                        <div className="flex gap-2">
                            <Button onClick={handleApprove} variant="default" className="flex-1">
                                Approve Course
                            </Button>
                            <Button
                                onClick={() => setShowRejectForm(true)}
                                variant="destructive"
                                className="flex-1"
                            >
                                Reject Course
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="rejection-reason">Rejection Reason</Label>
                            <Textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter the reason for rejecting this course..."
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleReject}
                                variant="destructive"
                                disabled={!rejectionReason.trim()}
                                className="flex-1"
                            >
                                Submit Rejection
                            </Button>
                            <Button
                                onClick={() => setShowRejectForm(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
